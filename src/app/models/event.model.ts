export interface Event {
    id?: number;
    description: string;
    neighborhood: string;
    registrationDateTime?: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'ACTIVE' | 'INACTIVE' | 'RESOLVED';
    roadblocks: Roadblock[];
  }
  
  export interface Roadblock {
    road: string;
    startRoad: string;
    endRoad: string;
    startDateTime: string;
    endDateTime: string;
  }
  
  export interface ScheduledEvent extends Event {
    regulationNumber: number;
    regulationPublicationDate: string;
  }
  
  export interface UnscheduledEvent extends Event {
    cause: 'ACCIDENT' | 'CONSTRUCTION' | 'DEMONSTRATION' | 'OTHER';
  }