import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DictionaryKey, PrintCostPartDto } from "@printhaus/common";
import { DictionaryService } from '../../../dictionary/services/dictionary/dictionary.service';
import { PrintMaterial } from '@haus/db-common/print-material/model/print-material';
const Dinero = require('dinero.js');

@Injectable()
export class PrintCostService {
    constructor(private dictionaryService: DictionaryService) {}

    public async getPrintCost(grams: number, printTimeHours: number, material: PrintMaterial): Promise<PrintCost> {
        const costPerKg = Dinero({ amount: material.costAmount, currency: material.costCurrency });

        const weightCost: PrintCostPartDto = await this.calculateWeightCost(grams, costPerKg);
        const timeCost: PrintCostPartDto = await this.calculateTimeCost(printTimeHours);
        const fixedCost: PrintCostPartDto = await this.calculateFixedCost();

        return {
            totalCost: Dinero(weightCost.cost).add(Dinero(timeCost.cost)).add(Dinero(fixedCost.cost)),
            costParts: [fixedCost, timeCost, weightCost]
        };
    }

    private async calculateWeightCost(grams: number, costPerKg: Dinero.Dinero): Promise<PrintCostPartDto> {
        try {
            const cost = costPerKg.multiply(grams / 1000);
            return new PrintCostPartDto(
                'Weight cost',
                `A variable cost that includes the price of the filament relative to the print weight (${costPerKg.toFormat(
                    await this.getMoneyFormat()
                )}/kg * ${grams.toFixed(1)}g)`,
                cost.toObject()
            );
        } catch (error) {
            throw new HttpException('Error calculating weight cost!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private async calculateTimeCost(printTimeHours: number): Promise<PrintCostPartDto> {
        try {
            const dictionaryValue = await this.dictionaryService.findByKey(DictionaryKey.PRINT_COST_PER_HOUR);
            const costPerHour: Dinero.Dinero = Dinero(JSON.parse(dictionaryValue.value));
            const cost: Dinero.Dinero = costPerHour.multiply(printTimeHours);

            return new PrintCostPartDto(
                'Time cost',
                `A variable cost that includes the time spent by the printer to print the model (${costPerHour.toFormat(
                    await this.getMoneyFormat()
                )} per hour).`,
                cost.toObject()
            );
        } catch (error) {
            throw new HttpException('Error calculating time cost!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private async calculateFixedCost(): Promise<PrintCostPartDto> {
        try {
            const dictionaryValue = await this.dictionaryService.findByKey(DictionaryKey.PRINT_FIXED_COST);
            const fixedCost: Dinero.Dinero = Dinero(JSON.parse(dictionaryValue.value));

            return new PrintCostPartDto(
                'Fixed cost',
                'A base fixed cost that includes consumables, spare parts, electricity, labour',
                fixedCost.toObject()
            );
        } catch (error) {
            throw new HttpException('Error calculating fixed cost!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private async getMoneyFormat(): Promise<string> {
        try {
            return this.dictionaryService.findByKey(DictionaryKey.MONEY_FORMAT).then((value) => value.value);
        } catch (error) {
            throw new HttpException('Error getting money format!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

export interface PrintCost {
    totalCost: Dinero.Dinero;
    costParts: PrintCostPartDto[];
}
