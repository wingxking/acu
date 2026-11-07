# 经穴研习馆 · Acupuncture Atlas

一个不依赖前端构建工具的中文针灸/经脉/腧穴定位学习网站，按 **一经一路由** 逐步学习。

## 内容

- 14 条经脉：十二正经 + 任脉 + 督脉，各自独立 HTML 页面
- 141 个重点穴位：编码、标准位置教学摘录、骨度/体表标志、简便辨认、特定穴属性、传统主治与安全说明
- 8 门基础课程：经络概论、阴阳与循行、骨度分寸、体表与脊柱、五输穴、原络郄/八脉交会/下合穴、五行与三焦、针刺安全
- 5 类常见问题知识专题与全站搜索/过滤、浏览器本地学习进度
- 原创 SVG 经脉**概念走向**图与骨度比例尺示意（**不是精准针刺图**）

现行 **GB/T 12346—2021** 标准收录 **362 经穴**；WHO 2008 版收录 361 穴。本项目目前只有 141 个重点穴位的详细卡片，不把未校订的穴位位置填入数据库。

## 路由

| 地址 | 内容 |
| --- | --- |
| `/` | 学习首页 |
| `/meridians/` | 十四经脉总览 |
| `/meridians/lu/` · … · `/meridians/gv/` | 14 经脉独立路由 |
| `/learn/` | 课程总览 |
| `/learn/bone-cun/` 等 | 8 门独立课程 |
| `/points/` | 141 个穴位检索 |
| `/topics/` | 症状学习专题 |
| `/sources/` | 标准与来源 |

## 运行与校验

网站全部是 HTML + CSS + 原生 JavaScript，不需要 `npm install` 或构建。

```bash
python3 -m http.server 8000
# 浏览 http://localhost:8000
node scripts/check.mjs
```

## GitHub Pages

已包含 `.github/workflows/pages.yml`，在 `main` 推送时运行内容校验并尝试发布至 GitHub Pages。首次使用需在仓库 **Settings → Pages → Build and deployment** 中将 **Source** 设为 **GitHub Actions**（需要仓库管理员权限配置）。部署成功后页面通常位于 `https://wingxking.github.io/acu/`，实际地址以 Pages 部署结果为准。

## 数据维护

- `assets/data.js`：经脉、重点穴、五输穴、原络郄、下合、背俞、课程数据
- `assets/app.js`：页面呈现、SVG 示意、搜索、学习进度
- `assets/style.css`：响应式视觉样式
- `meridians/*/index.html` / `learn/*/index.html`：可直接访问的静态路由
- `notes/ki3-ki6.md`：仓库初始的太溪/照海笔记原文，完整保留

## 标准、限制与安全

定位参考 [GB/T 12346—2021](https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=397548AE7248D3D87DD15E0AB8107185)、
[中国针灸标准网](https://www.ntcamsac.ac.cn/cms/content?id=105)、
[WHO 针灸穴位定位标准](https://iris.who.int/bitstream/handle/10665/353407/9789290613831-eng.pdf?sequence=1)。
针灸安全证据见 [NCCIH](https://www.nccih.nih.gov/health/acupuncture-effectiveness-and-safety)。

**本站为教学资料，不是医疗建议，也不提供自行针刺、艾灸或放血教学。** “传统主治”不是临床疗效承诺；网页简化经脉线绝不代表穴位的精确几何位置。
