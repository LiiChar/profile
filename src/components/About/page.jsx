import React from "react";
import "./about.css";
import Image from "next/image";
import AboutME from "./AboutMe/component";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div id="about">
      <div className="wrapAbout">
        <div className="ABOUT">ABOUT</div>
      </div>
      <div className="wrapAble">
        <div className="able">
          {about.map((elem) => (
            <motion.div
              key={elem.id}
              initial={{ x: elem.id % 2 === 0 ? 200 : -200, opasity: 0 }}
              whileInView={{ x: 0, opasity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="cardWrapper">
              <div className="card">
                <div className="image">
                  <Image
                    alt="Картинка"
                    sizes="min(25vw, 220px) min(25vw, 220px)"
                    src={elem.image}
                    fill={true}
                    placeholder="blur"
                    blurDataURL={elem.image}
                  />
                </div>
                <div>{elem.name}</div>
                <div>{elem.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <AboutME />
    </div>
  );
}

const about = [
  {
    id: 1,
    name: "Дизайн",
    description:
      "Гибкий и красивый интерфейс для привлечения внимания пользоваетелей",
    image: "/image/iconSkills/design.png",
  },

  {
    id: 2,
    name: "Новые идеи",
    description: "Уникальные идеи для ваших проектов",
    image: "/image/iconSkills/newIdea.png",
  },
  {
    id: 3,
    name: "Эффективность",
    description: "Быстрота и эффективность в приоритете",
    image: "/image/iconSkills/speed.png",
  },
  {
    id: 4,
    name: "Качество",
    description: "Качество ставиться во главе",
    image: "/image/iconSkills/able.png",
  },
];
