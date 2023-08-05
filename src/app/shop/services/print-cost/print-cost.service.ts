import { Injectable } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {CONFIG_KEYS} from "../../../common/util/config-keys.enum";
import { DineroObject } from "dinero.js";
import { PrintMaterial } from "@src/app/printing/models/print-material";
const Dinero = require('dinero.js')

@Injectable()
export class PrintCostService {

    constructor(private configService: ConfigService) {
    }

    public getPrintCost(grams: number, printTimeHours: number, material: PrintMaterial): PrintCost {
        const cost = Dinero({amount: 0, currency: 'RON'});
        const costPerKg = Dinero({amount: material.costAmount, currency: material.costCurrency});

        const weightCost: PrintCost = this.calculateWeightCost(grams, costPerKg);
        const timeCost: PrintCost = this.calculateTimeCost(printTimeHours);
        const fixedCost: PrintCost = this.calculateFixedCost();

        return {
            cost: cost.add(weightCost.cost).add(timeCost.cost).add(fixedCost.cost),
            costCalculationMessage: `${weightCost.costCalculationMessage} + ${timeCost.costCalculationMessage} + ${fixedCost.costCalculationMessage}`
        };
    }

    private calculateWeightCost(grams: number, costPerKg: Dinero.Dinero): PrintCost {
        const cost = costPerKg.multiply(grams / 1000);
        const costCalculationMessage = `${costPerKg.toFormat(this.moneyFormat)}/kg * ${grams.toFixed(1)}g`;
        return {
            cost: cost,
            costCalculationMessage: costCalculationMessage
        };
    }

    private calculateTimeCost(printTimeHours: number): PrintCost {
        const costPerHour: Dinero.Dinero = Dinero(JSON.parse(this.configService.get(CONFIG_KEYS.COSTS.COST_PER_HOUR)));
        const cost: Dinero.Dinero = costPerHour.multiply(printTimeHours);

        const costCalculationMessage: string = `${costPerHour.toFormat(this.moneyFormat)}/h * ${printTimeHours.toFixed(1)}h`;

        return {
            cost: cost,
            costCalculationMessage: costCalculationMessage
        }
    }

    private calculateFixedCost(): PrintCost {
        const fixedCost: Dinero.Dinero = Dinero(JSON.parse(this.configService.get(CONFIG_KEYS.COSTS.FIXED_COST)));
        return {
            cost: fixedCost,
            costCalculationMessage: `${fixedCost.toFormat(this.moneyFormat)}`
        }
    }
    
    private get moneyFormat(): string {
        return this.configService.get(CONFIG_KEYS.CURRENCY.MONEY_FORMAT);
    }
}

export interface PrintCost {
    cost: Dinero.Dinero,
    costCalculationMessage: string;
}
