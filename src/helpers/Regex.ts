export default class Regex {

    static phoneNumber(str:string) {
      return str.replace(/(9|09|989|00989)([0-3])([0-9])(\d{7})/ , `9$2$3$4`)
    }

}