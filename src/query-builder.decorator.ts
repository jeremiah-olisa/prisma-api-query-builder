// import { ApiPropertyOptional, ApiQuery } from '@nestjs/swagger';
// import { Transform } from 'class-transformer';
// import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';


// export class QueryFields implements IQueryFields {
//   @IsInt()
//   @IsOptional()
//   @IsPositive()
//   @ApiPropertyOptional({
//     default: 15,
//     description: 'How many records do you want to display',
//   })
//   @Transform((prop) => prop && parseInt(prop.value, 10))
//   limit: number;

//   @IsInt()
//   @IsOptional()
//   @IsPositive()
//   @ApiPropertyOptional({
//     default: 1,
//     description: 'The page you want to display',
//   })
//   @Transform((prop) => prop && parseInt(prop.value, 10))
//   page: number;

//   @IsString()
//   @IsOptional()
//   @ApiPropertyOptional({
//     default: 'createdAt',
//     description: 'How the records should be sorted from the database',
//   })
//   sort: string;

//   @IsString()
//   @IsOptional()
//   @ApiPropertyOptional({ description: 'The fields/columns you want to select' })
//   select: string;

//   @IsString()
//   @IsOptional()
//   @ApiPropertyOptional({
//     description: 'Relationships to include in your results',
//   })
//   include: string;

//   @IsString()
//   @IsOptional()
//   @ApiPropertyOptional({ description: 'Filter the results' })
//   filter: string;
// }

// export const SwaggerApiQueryBuilder = () => ApiQuery({ type: QueryFields });

export default {}