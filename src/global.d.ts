declare module 'react-native/Libraries/Blob/Blob' {
  class Blob {
    constructor(parts: Array<Blob | string>)

    get size(): number
  }

  export default Blob
}

declare module "react-native-pdf" {}
declare module "react-native-sound-player" {}