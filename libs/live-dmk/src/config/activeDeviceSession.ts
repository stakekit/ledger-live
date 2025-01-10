import { BehaviorSubject } from "rxjs";
import { DeviceManagementKitTransport } from "src/transport/DeviceManagementKitTransport";

export const activeDeviceSessionSubject: BehaviorSubject<{
  sessionId: string;
  transport: DeviceManagementKitTransport;
} | null> = new BehaviorSubject<{
  sessionId: string;
  transport: DeviceManagementKitTransport;
} | null>(null);
