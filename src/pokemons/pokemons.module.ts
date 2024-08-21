import { Module } from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { PokemonsController } from './pokemons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonsController],
  providers: [PokemonsService],
  imports:[
    MongooseModule.forFeature([{
      name:Pokemon.name,
      schema: PokemonSchema,
    }])
  ],
  exports:[MongooseModule]
})
export class PokemonsModule {}
