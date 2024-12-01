import { ClassConstructor } from 'class-transformer';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

//custom decorator for matching password in form (login and register)
export const Match = <T>(
  type: ClassConstructor<T>, //type of class
  property: (o: T) => any, //select property to watch
  validationOptions?: ValidationOptions,
) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,   //class of decorator
      propertyName,                 //name of property
      options: validationOptions,   //options
      constraints: [property],      //save property var
      validator: MatchConstraint,   //class to implement validation logic
    });
  };
};

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [fn] = args.constraints;      //get arguments
    return fn(args.object) === value;   //compare values
  }
  defaultMessage(args: ValidationArguments) {
    const [constraintProperty]: (() => any)[] = args.constraints;
    return `${constraintProperty} and ${args.property} does not match`;
  }
}