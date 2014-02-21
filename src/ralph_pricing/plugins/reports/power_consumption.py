# -*- coding: utf-8 -*-

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

import logging
from decimal import Decimal as D
from collections import OrderedDict, defaultdict

from django.utils.translation import ugettext_lazy as _

from ralph_pricing.models import UsageType
from ralph_pricing.plugins.base import register
from ralph_pricing.plugins.reports.base import (
    BaseSchemaPlugin,
    BaseUsagesPlugin,
)


logger = logging.getLogger(__name__)


@register(chain='reports')
class PowerConsumptionUsages(BaseUsagesPlugin):
    def run(self, start, end, ventures, forecast=False, **kwargs):
        logger.debug("Get power consumption usage")
        usage_type = UsageType.objects.get(symbol='power_consumption')
        usages = defaultdict(lambda: defaultdict(int))
        for warehouse in self.get_warehouses():
            warehouse_name = "".join(warehouse.name.split(' ')).lower()
            power_usages = self.get_usages_and_costs(
                start,
                end,
                ventures,
                usage_type,
                warehouse,
            )
            for venture, power_usage in power_usages.iteritems():
                key_name = 'power_consumption_count_{0}'.format(warehouse_name)
                usages[venture][key_name] = power_usage['value']
                key_name = 'power_consumption_cost_{0}'.format(warehouse_name)
                usages[venture][key_name] = power_usage['cost']
                if type(power_usage['cost']) in [int, float, type(D(0))]:
                    usages[venture]['power_consumption_total_cost'] += \
                        power_usage['cost']

        return usages


@register(chain='reports')
class PowerConsumptionSchema(BaseSchemaPlugin):
    def run(self, *args, **kwargs):
        """
        Build schema for this usage. Format of schema looks like:

        schema = {
            'field_name': {
                'name': 'Verbous name',
                'next_option': value,
                ...
            },
            ...
        }

        :returns dict: schema for usage
        :rtype dict:
        """
        logger.debug("Get power consumption schema")

        schema = OrderedDict()
        for warehouse in self.get_warehouses():
            warehouse_name = "".join(warehouse.name.split(' ')).lower()
            schema['power_consumption_count_{0}'.format(warehouse_name)] = {
                'name': _("Power consumption count ({0})".format(
                    warehouse_name,
                )),
            }
            schema['power_consumption_cost_{0}'.format(warehouse_name)] = {
                'name': _("Power consumption cost ({0})".format(
                    warehouse_name,
                )),
                'currency': True,
            }
        schema['power_consumption_total_cost'] = {
            'name': _("Power consumption total cost"),
            'currency': True,
            'total_cost': True,
        }
        return schema
