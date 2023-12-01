import 'dotenv/config';
import { intentClassifier } from './intent-classifier.util';

describe('classifyIntent', () => {
  jest.setTimeout(600000);

  it('should classify the intent', async () => {
    // const res = await intentClassifier('50 + 7');
    // const res = await intentClassifier('Linecker nasceu em Curitiba');
    const res = await intentClassifier("Linecker's surname is Amorim");
    console.log(res);
    expect(res.intention).toBeDefined()
  });

  it('should classify the intent: Information Retrieval', async () => {
    const expectedIntetion = 'Information Retrieval';

    const res1 = await intentClassifier('What is the current stock price of Apple Inc.?');
    expect(res1.intention).toBe(expectedIntetion);

    const res2 = await intentClassifier('Can you find the weather forecast for New York tomorrow?');
    expect(res2.intention).toBe(expectedIntetion);

    const res3 = await intentClassifier('Who won the Best Actor award at the Oscars last year?');
    expect(res3.intention).toBe(expectedIntetion);

    const res4 = await intentClassifier('What are the opening hours for the British Museum?');
    expect(res4.intention).toBe(expectedIntetion);

    const res5 = await intentClassifier('How many calories are in a banana?');
    expect(res5.intention).toBe(expectedIntetion);
  });

  it('should classify the intent: Task Execution', async () => {
    const expectedIntetion = 'Task Execution';

    const res1 = await intentClassifier('Please book a flight to Tokyo for next Thursday.');
    expect(res1.intention).toBe(expectedIntetion);

    const res2 = await intentClassifier('Send an email to the sales team with the updated presentation.');
    expect(res2.intention).toBe(expectedIntetion);

    const res3 = await intentClassifier('Create a new project file for the marketing campaign.');
    expect(res3.intention).toBe(expectedIntetion);

    const res4 = await intentClassifier('Set a reminder for my dentist appointment on March 5th.');
    expect(res4.intention).toBe(expectedIntetion);

    const res5 = await intentClassifier('Generate a monthly sales report and share it with the finance department.');
    expect(res5.intention).toBe(expectedIntetion);
  });

  it('should classify the intent: Assistance or Support', async () => {
    const expectedIntetion = 'Assistance or Support';

    const res1 = await intentClassifier("I'm having trouble logging into my account, can you help?");
    expect(res1.intention).toBe(expectedIntetion);

    const res2 = await intentClassifier('How do I reset my password?');
    expect(res2.intention).toBe(expectedIntetion);

    const res3 = await intentClassifier('Could you guide me through installing this software?');
    expect(res3.intention).toBe(expectedIntetion);

    const res4 = await intentClassifier('I need assistance with configuring my email settings.');
    expect(res4.intention).toBe(expectedIntetion);

    const res5 = await intentClassifier('Can you explain how to use the new project management tool?');
    expect(res5.intention).toBe(expectedIntetion);
  });

  it('should classify the intent: Analysis or Evaluation', async () => {
    const expectedIntetion = 'Analysis or Evaluation';

    const res1 = await intentClassifier("Analyze the recent trends in social media engagement for our brand.");
    expect(res1.intention).toBe(expectedIntetion);

    const res2 = await intentClassifier('Evaluate the performance of our latest advertising campaign.');
    expect(res2.intention).toBe(expectedIntetion);

    const res3 = await intentClassifier("Can you compare the last three years' financial statements?");
    expect(res3.intention).toBe(expectedIntetion);

    const res4 = await intentClassifier('Provide an analysis of the current market conditions in the tech industry.');
    expect(res4.intention).toBe(expectedIntetion);

    const res5 = await intentClassifier('Assess the customer feedback received in the past month.');
    expect(res5.intention).toBe(expectedIntetion);
  });

  it('should classify the intent: Feedback or Opinion', async () => {
    const expectedIntetion = 'Feedback or Opinion';

    const res1 = await intentClassifier("I think the new website design could be improved, here's my feedback.");
    expect(res1.intention).toBe(expectedIntetion);

    const res2 = await intentClassifier('I have some thoughts on the latest team meeting.');
    expect(res2.intention).toBe(expectedIntetion);

    const res4 = await intentClassifier("I'd like to provide my perspective on the proposed business strategy.");
    expect(res4.intention).toBe(expectedIntetion);

    const res5 = await intentClassifier('Here is my review of the book I just finished reading.');
    expect(res5.intention).toBe(expectedIntetion);
  });

  it('should classify the intent: Social Interaction or Engagement', async () => {
    const expectedIntetion = 'Social Interaction or Engagement';

    const res2 = await intentClassifier("What's your name?");
    expect(res2.intention).toBe(expectedIntetion);

    const res3 = await intentClassifier("I’d like to start a discussion about innovation in our industry.");
    expect(res3.intention).toBe(expectedIntetion);
  });

  it('should classify the intent: Exploration or Research', async () => {
    const expectedIntetion = 'Exploration or Research';

    const res1 = await intentClassifier("Research the latest developments in renewable energy.");
    expect(res1.intention).toBe(expectedIntetion);

    const res2 = await intentClassifier('Can you find information on starting a small business?');
    expect(res2.intention).toBe(expectedIntetion);

    const res3 = await intentClassifier("Explore potential locations for our next corporate retreat.");
    expect(res3.intention).toBe(expectedIntetion);

    const res4 = await intentClassifier("Look into the best practices for remote team management.");
    expect(res4.intention).toBe(expectedIntetion);

    const res5 = await intentClassifier('Find courses on digital marketing that I can take this year.');
    expect(res5.intention).toBe(expectedIntetion);
  });

  it('should classify the intent: Configuration or Customization', async () => {
    const expectedIntetion = 'Configuration or Customization';

    const res1 = await intentClassifier("Adjust my email notification settings to reduce frequency.");
    expect(res1.intention).toBe(expectedIntetion);

    const res2 = await intentClassifier('Customize my dashboard to show key performance metrics.');
    expect(res2.intention).toBe(expectedIntetion);

    const res4 = await intentClassifier("Can you change the language settings on my account to Spanish?");
    expect(res4.intention).toBe(expectedIntetion);

    const res5 = await intentClassifier('I need to configure the new software to match our workflow requirements.');
    expect(res5.intention).toBe(expectedIntetion);
  });
});
