'use client';

import { getCurrentUser } from "@/action/auth/login";
import { register } from "@/action/auth/register";
import { faker } from '@faker-js/faker';
import { useEffect } from "react";
import { toast } from "sonner";
import { generateUUID } from "three/src/math/MathUtils.js";

export const Auth = () => {
  useEffect(() => {
    const verify = async () => {
       const user = await getCurrentUser();

				if (!user) {
					const name = faker.person.firstName();
					const uuid = generateUUID();
					await register({
						name: name,
						password: uuid,
					});
          return false;
				} else {
          return true;
        }
    }
    verify().then((data) => {
      if (!data) {
        toast('Ваш профиль создан')
      } 
    })
  }, []);
	return (<></>)
}