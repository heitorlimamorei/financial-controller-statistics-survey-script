import { IFeedback, readJsonFile } from ".";

async function main() {
  const data: IFeedback[] = await readJsonFile('./output/feedbackids.json');

  if (!data) {
    return;
  }

  function sliceByField<T>(feedbacks: IFeedback[], field: string): T[] {
    return feedbacks.map((feedback) => feedback[field]);
  }

  const anyErros = sliceByField<boolean>(data, 'anyError');

  function contar<T>(array:T[]) {
    let sum = {positve: 0, negative: 0};

    array.forEach((c) => {
      if (c) {
        sum.positve += 1;
      } else {
        sum.negative += 1;
      }
    });

    if (array.length != sum.positve + sum.negative) {
      throw new Error('An issue in the sum');
    }
    
    return sum;
  }
  console.log(contar<boolean>(anyErros));
}

main();