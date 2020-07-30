import { IResolvers } from "graphql-tools";
import * as bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import {validate} from "class-validator";
import {getManager} from "typeorm";
import { User } from "./entity/User";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from './config/config';

export const resolvers: IResolvers = {
  Query: {
    me: (_, __, { req }) => {
      if (!req.userId) {
        return null;
      }

      return User.findOne(req.userId);
    }
  },
  Mutation: {
    register: async (_, { name, email, password }) => {

      const hashedPassword = await bcrypt.hash(password, 10);

      let user = new User();
      user.name = name;
      user.email = email;
      user.password = hashedPassword;

      const errors = await validate(user);
      if (errors.length > 0) {
          throw new Error(`Validation failed!`); 
      } else {
          await getManager().save(user);
      }
      
      const refreshToken = sign(
        { userId: user.id, name: user.name, count: user.count },
        REFRESH_TOKEN_SECRET!,
        {
          expiresIn: "7d"
        }
      );

      const accessToken = sign({ userId: user.id, name: user.name }, ACCESS_TOKEN_SECRET!, {
        expiresIn: "15min"
      });

      const dataReturn = {
        'token': accessToken,
        'token_refresh': refreshToken
      };

      console.log(dataReturn);

      return dataReturn;
    },
    login: async (_, { email, password }, { res }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return null;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return null;
      }

      const refreshToken = sign(
        { userId: user.id, name: user.name, count: user.count },
        REFRESH_TOKEN_SECRET!,
        {
          expiresIn: "7d"
        }
      );

      const accessToken = sign({ userId: user.id, name: user.name }, ACCESS_TOKEN_SECRET!, {
        expiresIn: "15min"
      });

      res.cookie("refresh-token", refreshToken);
      res.cookie("access-token", accessToken);

      const dataReturn = {
        'token': accessToken,
        'token_refresh': refreshToken
      };

      console.log(dataReturn);

      return dataReturn;
    }
  }
};
