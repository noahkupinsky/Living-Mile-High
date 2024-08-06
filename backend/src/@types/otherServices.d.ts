import { SiteData, DeepPartial } from "living-mile-high-lib";
import { GeneralData } from "./database";
import {
    CopyObjectCommandOutput, GetObjectCommandOutput, PutObjectAclCommandOutput,
} from "@aws-sdk/client-s3";
import {
    CdnAdapter,
    AssetService,
    BackupService,
} from "./cdnServices";
import {
    HouseService,
    AdminService,
    GeneralDataService,
    StateService,
    ContactLogService
} from "./dbServices";

export interface ServiceManager<T> {
    public connect(): Promise<T>;
    public disconnect(): Promise<void>;
}

export type ServiceDict = {
    houseService: HouseService;
    adminService: AdminService;
    assetService: AssetService;
    cdnAdapter: CdnAdapter;
    generalDataService: GeneralDataService;
    stateService: StateService;
    backupService: BackupService;
    contactLogService: ContactLogService;
};

export type SiteServiceManager = ServiceManager<ServiceDict>;

