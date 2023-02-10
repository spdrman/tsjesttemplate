import {getSymbols, saveToFile} from './data';

test('should say hello world', async () => {
  const shouldBe = 81176;
  //const actual = getSymbolsForType({ type: "equities" });
  return getSymbols().then(data => {
    //console.log(`result.length: ${data.length}`);
    if (data) {
      saveToFile(data).then(() => {
        expect(data.length).toEqual(shouldBe);
      });
    }
  });
});
