import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemons/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  async seed() {

    

    await this.pokemonModel.deleteMany({}); // delete * from pokemons

    const { data } = await axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=151');

    const pokemonToInsert = data.results.map(({ name, url }) => {
      let segment = url.split('/')
      let no = +segment[segment.length - 2]

      return { name, no }
    })

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Executed Seed';
  }
}
