const nombreUsuario = ( nombre, apellido ) => {
    const nom = nombre.split(" ");
    const ape = apellido.split(" ");
    const nomf  = nom[0].split();
    const apef  = ape[0].split();
    const nom_u = nomf[0].charAt(0).toUpperCase() + nomf[0].slice(1);
    const ape_u = apef[0].charAt(0).toUpperCase() + apef[0].slice(1);
    const usuario = nom_u.toString() +' '+ ape_u.toString();
    return usuario;
}

const claveCliente = () => {
  const clave: string = 'EstaesMiClaveSecreta';
  return clave;
}

class NotFoundError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "NotFoundError";
    }
}

class BadRequestError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "BadRequestError";
    }
  }

export {
    nombreUsuario, NotFoundError, BadRequestError, claveCliente
};
