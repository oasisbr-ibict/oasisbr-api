import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EvolutionIndicatorsModule } from '../evolution-indicators/evolution-indicators.module';
import { EvolutionIndicatorsService } from '../evolution-indicators/evolution-indicators.service';
import {
  EvolutionIndicator,
  EvolutionIndicatorSchema,
} from '../evolution-indicators/schemas/evolution-indicator.schema';
import { IndicatorsModule } from '../indicators/indicators.module';
import { IndicatorsService } from '../indicators/indicators.service';
import {
  Indicator,
  IndicatorSchema,
} from '../indicators/schemas/indicator.schema';
import { NetworksModule } from '../networks/networks.module';
import { NetworksService } from '../networks/networks.service';
import { Network, NetworkSchema } from '../networks/schemas/network.schema';
import { ParamsService } from '../params/params.service';
import { Param, ParamSchema } from '../params/schemas/param.schema';
import { OasisbrService } from './oasisbr.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 120000,
        maxRedirects: 5,
      }),
    }),
    NetworksModule,
    IndicatorsModule,
    EvolutionIndicatorsModule,
    MongooseModule.forFeature([{ name: Network.name, schema: NetworkSchema }]),
    MongooseModule.forFeature([
      { name: Indicator.name, schema: IndicatorSchema },
    ]),
    MongooseModule.forFeature([
      { name: EvolutionIndicator.name, schema: EvolutionIndicatorSchema },
    ]),
    MongooseModule.forFeature([{ name: Param.name, schema: ParamSchema }]),
  ],
  controllers: [],
  providers: [
    OasisbrService,
    NetworksService,
    IndicatorsService,
    EvolutionIndicatorsService,
    ParamsService,
    Logger,
  ],
})
export class OasisbrModule {}
