import { Rule } from ".";

export const AdminRule: Rule = {
   auth: true,
   owner: undefined,
   role: "Admin"
};

export const OwnerRule: Rule = {
   auth: true,
   owner: true,
   role: undefined
};

export const AnonymousRule: Rule = {
   auth: false,
   owner: undefined,
   role: undefined
};

export const AdminAndOwnerOnly: Rule[] = [AdminRule, OwnerRule];
