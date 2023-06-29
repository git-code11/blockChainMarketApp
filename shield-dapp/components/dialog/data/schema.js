import * as yup from "yup";

export const addToSaleSchema = yup.object({
    amount: yup.number().moreThan(0, "Invalid Price").required("Set Price"),
    currency: yup.string().required("required"),
    duration: yup.number().min(0, "invalid").required("required"),
}).required();


export const createAuctionSchema = yup.object({
    reserve: yup.number().positive().moreThan(0).required("Set Reserve Price"),
    startTime: yup.date().required("Start Date Required"),
    endTime:yup.date().required("End Date Required"),
    diffTime: yup.number().positive().moreThan(0).required("invalid"),//for unscheduled mode
    scheduled:yup.boolean().required()
}).required();


export const extendAuctionSchema = yup.object({
    extendTime:yup.number().moreThan(0).required()
}).required();
