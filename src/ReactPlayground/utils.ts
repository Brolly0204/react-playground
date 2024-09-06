import { strFromU8, strToU8, unzlibSync, zlibSync } from "fflate"
import saveAs from "file-saver"
import JSZip from "jszip"

export const fileName2Language = (name: string) => {
  const suffix = name.split('.').pop() || ''
  if (['js', 'jsx'].includes(suffix)) return 'javascript'
  if (['ts', 'tsx'].includes(suffix)) return 'typescript'
  if (['json'].includes(suffix)) return 'json'
  if (['css'].includes(suffix)) return 'css'
  return 'javascript'
}



/**
 * 压缩字符串数据
 * @param {string} data - 要压缩的字符串
 * @returns {string} - 压缩后的字符串，经过base64编码
 */
export function compress(data: string): string {
  // 将字符串转换为 Uint8Array
  const buffer = strToU8(data)
  // 使用 zlibSync 进行同步压缩，压缩级别为9
  const zipped = zlibSync(buffer, { level: 9 })
  // 将压缩后的数据转换回字符串，并使用 base64 编码
  const str = strFromU8(zipped, true)
  // 对编码后的字符串进行 base64 编码，并返回结果
  return btoa(str)
}

/**
 * 解压缩base64编码的数据
 * @param {string} base64 - 要解压缩的base64编码的字符串
 * @returns {string} - 解压缩后的字符串
 */
export function uncompress(base64: string): string {
  // 使用 atob 函数将 base64 编码的字符串解码为二进制字符串
  const binary = atob(base64)
  // 使用 strToU8 函数将二进制字符串转换为 Uint8Array，第二个参数 true 表示使用 UTF-8 编码
  const buffer = strToU8(binary, true)
  // 使用 unzlibSync 函数对 Uint8Array 进行解压缩
  const unzipped = unzlibSync(buffer)
  // 使用 strFromU8 函数将解压缩后的 Uint8Array 转换为字符串
  return strFromU8(unzipped)
}

export async function downloadFiles(files: Files) {
  const zip = new JSZip()
  // const folder = zip.folder("images");
  Object.keys(files).forEach((name) => {
    zip.file(name, files[name].value)
  })

  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, `code${Math.random().toString().slice(2, 8)}.zip`)
}