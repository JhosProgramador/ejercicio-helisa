const name = input.name?.trim();
if (!name) throw new EmptyNameError();
return new Account(input.code, name, nature, parentCode);