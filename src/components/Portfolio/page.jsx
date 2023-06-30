import Image from "next/image";
import React, { memo } from "react";
import Project from "@/components/Portfolio/Project/component";
import { AnimatePresence, motion } from "framer-motion";
import "./portfolio.css";

const Portfolio = () => {
  const [visible, setVisible] = React.useState(0);
  const [filter, setFilter] = React.useState("");
  const [visionDescription, setVisionDescription] = React.useState(0);

  let data = datas.filter((el) =>
    filter == "" ? true : el.tags.includes(filter.toLowerCase())
  );

  const handleVisionDescription = React.useCallback((num) => {
    setVisionDescription(num)
  }, [])

  return (
    <div id="portfolio">
      <div className="wrapName">
        <div className="PROJECTS">PROJECTS</div>
      </div>
      <div className="wrapProjects">
        <div className="filterTags">
          <div className="tags">
            <div
              className={filter == "" ? "pick" : ""}
              onClick={() => setFilter("")}>
              ALL
            </div>
            <div
              className={filter == "node" ? "pick" : ""}
              onClick={() => setFilter("node")}>
              NODE
            </div>
            <div
              className={filter == "react" ? "pick" : ""}
              onClick={() => setFilter("react")}>
              REACT
            </div>
            <div
              className={filter == "nest" ? "pick" : ""}
              onClick={() => setFilter("nest")}>
              NEST
            </div>
            <div
              className={filter == "javascript" ? "pick" : ""}
              onClick={() => setFilter("javascript")}>
              JAVASCRIPT
            </div>
          </div>
        </div>
        <div className="projectsWrap">
          <AnimatePresence>
            {data.map((proj) => (
              <motion.div
                key={proj.id}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ ease: "easeOut", duration: 0.6 }}
                exit={{ x: 100, opacity: 0 }}
                onMouseOver={() => setVisible(proj.id + 1)}
                onMouseOut={() => setVisible(0)}
                className="project">
                <div
                  style={{
                    zIndex: "-1",
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}>
                  <Image
                    alt="img"
                    src={proj.image}
                    className="imagerat"
                    priority={true}
                    sizes="calc(50vw - 8px) calc(50vw - 8px)"
                    fill={true}
                  />
                </div>
                {visible == proj.id + 1 && (
                  <motion.div
                    className="infoProject"
                    initial="hidden"
                    animate="visibles"
                    exit={{ scale: 0.8, opacity: 0 }}
                    variants={{
                      hidden: {
                        scale: 0.8,
                        opacity: 0,
                      },

                      visibles: {
                        scale: 1,
                        opacity: 1,
                        transition: {
                          delay: 0.1,
                        },
                      },
                    }}>
                    <div className="wrapInfoProj">
                      <div className="infoProj">
                        <div className="nameProject">{proj.name}</div>
                      </div>
                      <div>
                        <button
                          onClick={() => handleVisionDescription(proj.id + 1)}
                          className="buttonProject">
                          LEARN MORE
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {visionDescription == proj.id + 1 && (
                  <Project data={proj} close={() => handleVisionDescription(0)} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

let datas = [
    {
      id: 0,
      name: "Чат",
      description:
        "Сайе-чат с глобальным чатом. Технологии использованные при разработке: socket.io, express, reactjs",
      image: "/image/proj/chat.png",
      linkProd: "",
      linkCode: "",
      tags: ["react", "node"],
    },
    {
      id: 1,
      name: "Интернет-магазин",
      description:
        "Интернет магазин, фронтенд написан на reactjs, бекэед на чистом php",
      image: "/image/proj/shop.jpg",
      linkProd: "",
      linkCode: "",
      tags: ["nest", "react"],
    },
    {
      id: 2,
      name: "Блог",
      description:
        "Сайт для размещения блогов, фронтенд написан на reactjs, бекэед на nestjs",
      image: "/image/proj/habric.png",
      linkProd: "",
      linkCode: "",
      tags: ["react", "nest"],
    },
    {
      id: 3,
      name: "Бот для менеджмента сотрудников",
      description:
        "Телеграмм бот для отслуживания работы сотрудников, написанный на nodejs",
      image: "/image/proj/bot.png",
      linkProd: "",
      linkCode: "",
      tags: ["node"],
    },
    {
      id: 4,
      name: "Расписание пар",
      description:
        "Сайт для просмотра расписания, написанный на чистом javascript",
      image: "/image/proj/rasp.png",
      linkProd: "https://raspisanie-pi.vercel.app/",
      linkCode: "https://github.com/LiiChar/Raspisanie",
      tags: ["javascript"],
    },
    {
      id: 5,
      name: "Расписание автобусов",
      description: "Сайт для просмотра расписания, написанный на nodejs",
      image: "/image/proj/bus.png",
      linkProd: "",
      linkCode: "",
      tags: ["node"],
    },
  ];

export default Portfolio;
