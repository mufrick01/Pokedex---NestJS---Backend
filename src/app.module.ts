import { Module } from '@nestjs/common';
import { PokemonsModule } from './pokemons/pokemons.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI,{dbName:process.env.MONGO_DB_NAME}),
    PokemonsModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
