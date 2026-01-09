import HoursSchema, { IHours } from './Hours';

export interface ISchedule {
    monday: IHours,
    tuesday: IHours,
    wednesday: IHours,
    thursday: IHours,
    friday: IHours,
    saturday: IHours,
    sunday: IHours
}

export const scheduleDefinition = {
    monday: HoursSchema,
    tuesday: HoursSchema,
    wednesday: HoursSchema,
    thursday: HoursSchema,
    friday: HoursSchema,
    saturday: HoursSchema,
    sunday: HoursSchema
};