
import type { NextApiRequest, NextApiResponse } from 'next';
const formidable = require('formidable');
const fs = require('fs');
const pdfParse = require('pdf-parse');
import { sampleItems } from '@/lib/sample-data';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err || !files.file) {
      return res.status(400).json({ error: '파일 업로드 실패', items: sampleItems, fallback: true });
    }
    try {
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      const data = fs.readFileSync(file.filepath);
      const pdfData = await pdfParse(data);
      // 간단한 표 추출: 줄 단위로 분리 후, 숫자 포함된 줄만 추출
      const lines = (pdfData.text as string).split('\n').map((l: string) => l.trim()).filter(Boolean);
      // 예시: 3개 이상의 숫자가 포함된 줄을 품목으로 간주
      const items = lines
        .map((line: string) => {
          const nums = line.match(/\d+/g);
          if (nums && nums.length >= 3) {
            return {
              id: Math.random().toString(36).slice(2),
              name: line.split(/\d/)[0].trim() || '품목',
              spec: '-',
              quantity: Number(nums[0]),
              unitPrice: Number(nums[1]),
            };
          }
          return null;
        })
        .filter(Boolean);
      if (items.length === 0) {
        return res.status(200).json({ items: sampleItems, fallback: true });
      }
      return res.status(200).json({ items, fallback: false });
    } catch (e) {
      return res.status(500).json({ error: 'PDF 파싱 실패', items: sampleItems, fallback: true });
    }
  });
}
