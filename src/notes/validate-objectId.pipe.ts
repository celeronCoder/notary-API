import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from "@nestjs/common";

import * as mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

@Injectable()
export class ValidateObjectId implements PipeTransform {
    transform(value: string, _metadata: ArgumentMetadata) {
        if (ObjectId.isValid(value)) {
            if (String(new ObjectId(value)) === value) return value;
            throw new BadRequestException("id is not valid.");
        }
        throw new BadRequestException("id is not valid.");
    }
}