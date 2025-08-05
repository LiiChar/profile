// 'use client';
//
// import { useEffect, useRef, useState } from 'react';
// import * as d3 from 'd3';
// import { sugiyama, graphStratify } from 'd3-dag';
// import { getCommits } from '@/action/git/getCommits';
//
// interface Commit {
//     sha: string;
//     html_url: string;
//     commit: {
//         message: string;
//         author: { name: string; date: string };
//     };
//     parents: { sha: string }[];
// }
//
// export default function CommitDagTree() {
//     const svgRef = useRef<SVGSVGElement>(null);
//     const [commits, setCommits] = useState<Commit[]>([]);
//
//     useEffect(() => {
//         const fetchData = async () => {
//             const data = await getCommits();
//             setCommits(data.slice(0, 50)); // Ограничение для читаемости
//         };
//         fetchData();
//     }, []);
//
//     useEffect(() => {
//         if (!commits.length) return;
//
//         // Создаём массив для d3-dag
//         const nodes = commits.map((c) => ({
//             id: c.sha,
//             parentIds: c.parents.map((p) => p.sha),
//         }));
//
//         // Фильтруем связи на несуществующих родителей
//         const shaSet = new Set(nodes.map((n) => n.id));
//         for (const node of nodes) {
//             node.parentIds = node.parentIds.filter((pid) => shaSet.has(pid));
//         }
//
//         // Генерация DAG
//         const stratify = graphStratify()
//             .id((d: any) => d.id)
//             .parentIds((d: any) => d.parentIds);
//
//         const dag = stratify(nodes);
//
//         // Layout
//         const width = 1000;
//         const height = 1600;
//         const layout = sugiyama()
//             .size([width - 100, height - 100]) // отступы
//             .layering(d3.layeringLongestPath())
//             .decross(d3.decrossTwoLayer())
//             .coord(d3.coordVert());
//
//         layout(dag);
//
//         // Подготовка к отрисовке
//         const svg = d3.select(svgRef.current);
//         svg.selectAll('*').remove();
//
//         const g = svg.append('g').attr('transform', 'translate(50,50)');
//
//         // Связи (ребра)
//         g.append('g')
//             .selectAll('path')
//             .data(dag.links())
//             .join('path')
//             .attr('d', ({ source, target }) => `M${source.x},${source.y}L${target.x},${target.y}`)
//             .attr('stroke', '#94a3b8')
//             .attr('stroke-width', 1.5)
//             .attr('fill', 'none');
//
//         // Узлы (коммиты)
//         const nodesG = g
//             .append('g')
//             .selectAll('g')
//             .data(dag.descendants())
//             .join('g')
//             .attr('transform', (d) => `translate(${d.x},${d.y})`);
//
//         nodesG
//             .append('circle')
//             .attr('r', 6)
//             .attr('fill', (d) =>
//                 d.data.parentIds.length > 1 ? '#f97316' : '#3b82f6'
//             );
//
//         nodesG
//             .append('text')
//             .text((d) => d.id.slice(0, 7))
//             .attr('x', 10)
//             .attr('y', 4)
//             .attr('font-size', 10)
//             .attr('fill', '#1e293b');
//
//         // Добавим зум
//         svg.call(
//             d3.zoom<SVGSVGElement, unknown>()
//                 .scaleExtent([0.3, 3])
//                 .on('zoom', (event) => {
//                     g.attr('transform', event.transform);
//                 })
//         );
//     }, [commits]);
//
//     return (
//         <div className="overflow-auto border rounded max-h-[700px]">
//             <svg ref={svgRef} width={1000} height={1600} />
//         </div>
//     );
// }
