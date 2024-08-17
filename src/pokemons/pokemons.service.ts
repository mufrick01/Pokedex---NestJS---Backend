import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { CreatePokemonDto, UpdatePokemonDto } from './dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonsService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {

    try {

      createPokemonDto.name = createPokemonDto.name.toLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon;

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all pokemons`;
  }

  async findOne(term: string) {

    let pokemon: Pokemon


    if (isValidObjectId(term)) pokemon = await this.pokemonModel.findById(term)
    if (!pokemon && !isNaN(+term)) { pokemon = await this.pokemonModel.findOne({ no: +term }) }
    if (!pokemon) { pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() }) }

    if (!pokemon) { throw new NotFoundException(`pokemon with id, name or no : ${term} not found`) }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    let pokemon = await this.findOne(term);

    if (pokemon.name) pokemon.name = pokemon.name.toLowerCase();

    try {

      await pokemon.updateOne(updatePokemonDto)

      return { ...pokemon.toJSON(), ...updatePokemonDto }

    } catch (error) {
      this.handleExceptions(error);
    }

  }

  async remove(id: string) {
    const {deletedCount} = await this.pokemonModel.deleteOne({ _id: id })
    if(deletedCount===0){
      throw new BadRequestException(`pokemon with id "${id}" not found`)
    }
    return;
  }


  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokémon's unique-key exists in the database ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`)
  }
}
