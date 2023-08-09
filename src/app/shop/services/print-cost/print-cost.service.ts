import { Injectable } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {CONFIG_KEYS} from "../../../common/util/config-keys.enum";
import { PrintMaterial } from "@src/app/printing/models/print-material";
import { PrintCostPartDto } from '@printnuts/common';
import { DineroObject } from "dinero.js";
const Dinero = require('dinero.js')

@Injectable()
export class PrintCostService {

    constructor(private configService: ConfigService) {
    }

    public getPrintCost(grams: number, printTimeHours: number, material: PrintMaterial): PrintCost {
        const costPerKg = Dinero({amount: material.costAmount, currency: material.costCurrency});

        const weightCost: PrintCostPartDto = this.calculateWeightCost(grams, costPerKg);
        const timeCost: PrintCostPartDto = this.calculateTimeCost(printTimeHours);
        const fixedCost: PrintCostPartDto = this.calculateFixedCost();

        return {
            totalCost: Dinero(weightCost.cost).add(Dinero(timeCost.cost)).add(Dinero(fixedCost.cost)),
            costParts: [fixedCost, timeCost, weightCost]
        };
    }

    private calculateWeightCost(grams: number, costPerKg: Dinero.Dinero): PrintCostPartDto {
        const cost = costPerKg.multiply(grams / 1000);
        return new PrintCostPartDto('Weight cost',
            `A variable cost that includes the price of the filament relative to the print weight (${costPerKg.toFormat(this.moneyFormat)}/kg * ${grams.toFixed(1)}g)`,
            cost.toObject())
    }

    private calculateTimeCost(printTimeHours: number): PrintCostPartDto {
        const costPerHour: Dinero.Dinero = Dinero(JSON.parse(this.configService.get(CONFIG_KEYS.COSTS.COST_PER_HOUR)));
        const cost: Dinero.Dinero = costPerHour.multiply(printTimeHours);

        return new PrintCostPartDto('Time cost',
            `A variable cost that includes the time spent by the printer to print the model (${costPerHour.toFormat(this.moneyFormat)} per hour).`,
            cost.toObject());
    }

    private calculateFixedCost(): PrintCostPartDto {
        const fixedCost: Dinero.Dinero = Dinero(JSON.parse(this.configService.get(CONFIG_KEYS.COSTS.FIXED_COST)));
        return new PrintCostPartDto('Fixed cost',
            'A base fixed cost that includes consumables, spare parts, electricity, labour',
            fixedCost.toObject());
    }
    
    private get moneyFormat(): string {
        return this.configService.get(CONFIG_KEYS.CURRENCY.MONEY_FORMAT);
    }
}

export interface PrintCost {
    totalCost: Dinero.Dinero;
    costParts: PrintCostPartDto[];
}
