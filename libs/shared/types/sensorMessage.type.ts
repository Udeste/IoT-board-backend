export interface ISensorMessage {
  device: string
  measurements: {
    [key: string]: number
  }
}