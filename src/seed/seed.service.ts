import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemons/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http : AxiosAdapter,
  ) { }

  async seed() {


    await this.pokemonModel.deleteMany({}); // delete * from pokemons

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=151');

    const pokemonToInsert = data.results.map(({ name, url }) => {
      let segment = url.split('/')
      let no = +segment[segment.length - 2]

      return { name, no }
    })

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Executed Seed';
  }
}
