import { RowDataPacket } from "mysql2";
import { MobileAppBike } from "@trungthao/mobile_app_dto";

export interface MobileAppBikeDTO extends MobileAppBike, RowDataPacket  {

}