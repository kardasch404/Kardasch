import { Injectable } from '@nestjs/common';
import * as deepl from 'deepl-node';

@Injectable()
export class TranslationService {
  private translator: deepl.Translator;

  constructor() {
    this.translator = new deepl.Translator(process.env.DEEPL_API_KEY || '');
  }

  async translate(text: string, targetLang: string) {
    const result = await this.translator.translateText(text, null, targetLang as deepl.TargetLanguageCode);
    return result.text;
  }
}
