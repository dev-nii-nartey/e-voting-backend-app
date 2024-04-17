export class Password {
  static generate(passwordLength: number =5) {
    let characters =
      "abcdefghIJKLMNTUVWXYZ056789@$%&";
    let charactersLength = characters.length;
    let generatedPassword = "";

    for (let i = 0; i < passwordLength; i++) {
      let index = Math.floor(charactersLength * Math.random());

      if (index === charactersLength) {
        index -= 1;
      }

      generatedPassword += characters[index];
    }

    return `VtAp-${generatedPassword}`;
  }
}
