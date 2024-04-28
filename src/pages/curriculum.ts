import type { APIRoute } from "astro";
import pdf from 'pdfjs';
import helvetica from 'pdfjs/font/Helvetica';
import helveticaBold from 'pdfjs/font/Helvetica-Bold';
import { basics, work, projects, education } from "@cv"

type Profile = {
    network: string
    username: string
    url: string
}

type Work = {
    name: string
    position: string
    url: string
    startDate: string
    endDate: string
    summary: string
    highlights: string[]
}

type Education = {
    institution: string;
    url: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate: string;
    score: string;
    courses: string[];
}

export const GET: APIRoute = async () => {
    try {
        const doc = new pdf.Document(
            {
                font: helvetica,
                paddingLeft: 3 * pdf.cm,
                paddingRight: 3 * pdf.cm,
            });



        // const header = doc
        //     .header()
        //     .table({ widths: [null, null, null], paddingBottom: 1 * pdf.cm, })
        //     .row();


        const cell = doc.cell({ paddingBottom: 0.5 * pdf.cm });

        function titleSection(title: string) {
            cell.cell(title, { fontSize: 22, font: helvetica });
            cell.cell({ borderBottomWidth: 1 })
            cell.cell({ paddingBottom: 10 })
        }

        function formattedSummary(summary: string) {
            const strongTextRegex = /<strong>(.*?)<\/strong>/g;
            let summaryParts = summary.split(strongTextRegex);
            console.log({ summaryParts })
            const textInstance = cell.text();
            summaryParts.forEach((part, index) => {
                if (index % 2 === 0) {
                    if (index === 0) {
                        textInstance.add(part);
                    } else {
                        textInstance.add(part);
                    }
                } else {
                    textInstance.add(part, { font: helveticaBold, color: 0x0000ff });
                }
            });
        }

        function profilesPrint(profiles: Array<Profile>) {
            profiles.map((profile: Profile) => {
                cell.text(profile.url, { link: profile.url })
            })
        }

        function worksPrint(works: Array<Work>) {
            works.map((item) => {
                cell
                    .cell({ paddingBottom: 0.1 * pdf.cm, fontSize: 14 })
                    .text(item.name)
                    .add(item.startDate, { fontSize: 12, color: 0xccccc })
                    .add(' - ', { color: 0xcccccc })
                    .add(item.endDate ? item.endDate : "Actualidad", { fontSize: 12, color: 0xccccc })
                cell
                    .cell({ paddingBottom: 0.5 * pdf.cm })
                    .text(item.summary)
            })
        }

        function educationPrint(education: Array<Education>) {
            education.map((item) => {
                cell
                    .cell({ paddingBottom: 0.1 * pdf.cm, fontSize: 14 })
                    .text(item.area)
                    .add(item.startDate, { fontSize: 12, color: 0xccccc })
                    .add(' - ', { color: 0xcccccc })
                    .add(item.endDate ? item.endDate : "Actualidad", { fontSize: 12, color: 0xccccc })
                cell
                    .cell({ paddingBottom: 0.5 * pdf.cm })
                    .text(item.institution)
            })
        }

        cell.cell(basics.name, { fontSize: 24, font: helveticaBold })
        cell.cell({ paddingBottom: 5 })

        formattedSummary(basics.summary)
        profilesPrint(basics.profiles)

        cell.cell({ paddingBottom: 20 })

        titleSection('Trabajos')
        worksPrint(work)


        titleSection('Proyectos')
        projects.map((item) => {
            cell
                .cell({ paddingBottom: 0.1 * pdf.cm, fontSize: 14 })
                .text(item.name)
            cell
                .cell({ paddingBottom: 0.5 * pdf.cm })
                .text(item.description)

            // item.tecnologies.map((tecno) => {
            //     cell
            //         .cell({ paddingBottom: 0.5 * pdf.cm })
            //         .text(tecno[0][0])

            // })
        })

        titleSection('Educación')
        educationPrint(education)

        doc.footer().pageNumber(
            function (curr, total) {
                return curr + ' / ' + total;
            },
            { textAlign: 'center' }
        );

        const buffer = await doc.asBuffer();

        return new Response(buffer, {
            headers: { 'Content-Type': 'application/pdf' },
            status: 200
        });
    } catch (error: unknown) {
        throw new Error(`Something went wrong in pdf-resource.pdf route!: ${error as string}`);
    }
}