import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import type { TelemetryDto } from './dto/telemetry.dto';

@Controller('telemetry')
export class IngestionController {
    constructor(private readonly ingestionService: IngestionService) { }

    @Post()
    async ingestTelemetry(@Body() data: Record<string, any>) {
        const telemetryData = data as TelemetryDto;

        if (telemetryData.type === 'meter') {
            return this.ingestionService.ingestMeterData(telemetryData);
        } else if (telemetryData.type === 'vehicle') {
            return this.ingestionService.ingestVehicleData(telemetryData);
        } else {
            throw new BadRequestException('Invalid telemetry type');
        }
    }
}
