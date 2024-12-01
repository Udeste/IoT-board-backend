import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InfluxDB, Point } from '@influxdata/influxdb-client'
import { OrgsAPI, BucketsAPI, Buckets } from '@influxdata/influxdb-client-apis'


@Injectable()
export class IotBoardInfluxervice {
  private readonly influxHost = this.configService.get<string>('IOTBRD_SENSORS_API_INFLUX_URL', 'https://localhost:8086')
  private readonly influxToken = this.configService.get<string>('IOTBRD_SENSORS_API_INFLUX_TOKEN', '')
  private readonly influxOrg = this.configService.get<string>('IOTBRD_SENSORS_API_INFLUX_ORG', 'iot-board')
  private influxOrgId = ''
  private influxDB: InfluxDB;
  private orgsAPI: OrgsAPI;
  private bucketsAPI: BucketsAPI;

  constructor(private configService: ConfigService) {
    this.init()
  }

  async init() {
    this.influxDB = new InfluxDB({ url: this.influxHost, token: this.influxToken })
    this.orgsAPI = new OrgsAPI(this.influxDB)

    const organizations = await this.orgsAPI.getOrgs({ org: this.influxOrg })
    if (!organizations || !organizations.orgs || !organizations.orgs.length) {
      console.error(`No organization named "${this.influxOrg}" found!`)
    }
    this.influxOrgId = organizations.orgs[0].id
    console.log(`Using organization "${this.influxOrg}" identified by "${this.influxOrgId}"`)

    this.bucketsAPI = new BucketsAPI(this.influxDB)
  }

  async checkAndCreateBucket(bucketName: string) {
    console.log(`[INFLUX] Checking bucket "${bucketName}"`)

    let buckets: Buckets
    try {
      buckets = await this.bucketsAPI.getBuckets({ org: this.influxOrg, name: bucketName })
    } catch {
      buckets = null
    }

    if (buckets && buckets.buckets && buckets.buckets.length) {
      console.log(`[INFLUX] Bucket named "${bucketName}" already exists`)
      return false
    }

    console.log(`[INFLUX] Create Bucket "${bucketName}"`)
    // creates a bucket, entity properties are specified in the "body" property
    const bucket = await this.bucketsAPI.postBuckets({ body: { orgID: this.influxOrgId, name: bucketName } })
    return bucket
  }

  async deleteBucket(bucketName: string) {
    console.log(`[INFLUX] Deleting bucket "${bucketName}"`)

    let buckets: Buckets
    try {
      buckets = await this.bucketsAPI.getBuckets({ org: this.influxOrg, name: bucketName })
    } catch {
      buckets = null
    }

    let bucketID
    if (buckets && buckets.buckets && buckets.buckets.length) {
      console.log(`[INFLUX] Bucket named "${bucketName}" found`)
      bucketID = buckets.buckets[0].id
    } else {
      console.log(`[INFLUX] Bucket named "${bucketName}" not found`)
      return
    }

    await this.bucketsAPI.deleteBucketsID({ bucketID: bucketID })
    console.log(`[INFLUX] Deleted Bucket "${bucketName}"`)
    return
  }
  
  async saveData(bucket: string, payload: { [key: string]: string | number }, tags: { [key: string]: string }) {
    const writeApi = this.influxDB.getWriteApi(this.influxOrg, bucket, 'ms')

    const points = Object.entries(payload).reduce((pp, [measurement, value]) => {
      const point = new Point(measurement).floatField('value', value)

      Object.entries(tags).forEach(([key, value]) => point.tag(key, value))

      pp.push(point)
      return pp
    }, [])

    writeApi.writePoints(points)

    try {
      await writeApi.close()
      console.log('Wrote data points')
    } catch (e) {
      console.error(e)
    }
  }
}
