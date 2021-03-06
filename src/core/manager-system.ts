import path from "path";

import { MusicInfoType, MusicRemovedInfos } from "../types";
import { FetchApi } from "./fetch-api";
import { ManagerData } from "./manager-data";

export class ManagerSystem {
  private readonly managerData: ManagerData = new ManagerData();
  private readonly fetchApi: FetchApi = new FetchApi();
  private readonly saveMusicFrom: string = path.resolve(__dirname + "../../../musics");

  async onBotStart() {
    await this.storageMusics();
    return;
  }

  async onMusicAdd(music: MusicInfoType) {
    await this.storeNewMusic(music);
    return;
  }

  async onMusicRemoved(music: MusicRemovedInfos) {
    const musics = await this.fetchApi.getMusicsList();
    await this.managerData.resetMusicsInfos(musics);
    await this.managerData.deleteMusicFile(`${music.id}.mp3`);
    return;
  }

  private async storageMusics() {
    const musics = await this.fetchApi.getMusicsList();

    musics.forEach((music) => {
      this.fetchApi.downloadMusic(music.id, this.saveMusicFrom, music.id);
    });

    await this.managerData.storeMusicsInfos(musics);
  }

  private async storeNewMusic(music: MusicInfoType) {
    this.fetchApi.downloadMusic(music.id, this.saveMusicFrom, music.id);
    this.managerData.updateMusicsInfos(music);
  }
}
