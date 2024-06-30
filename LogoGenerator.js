const fs = require('fs');

class LogoGenerator {
  async getUserInput() {
    const inquirerModule = await import('inquirer');
    const inquirer = inquirerModule.default;

    const questions = [
      {
        type: 'input',
        name: 'text',
        message: 'Enter up to three characters:',
        validate: input => input.length <= 3 || 'Text must be 3 characters or less',
      },
      {
        type: 'input',
        name: 'textColor',
        message: 'Enter text color (keyword or hexadecimal):',
      },
      {
        type: 'list',
        name: 'shape',
        message: 'Choose a shape:',
        choices: ['circle', 'triangle', 'square'],
      },
      {
        type: 'input',
        name: 'shapeColor',
        message: 'Enter shape color (keyword or hexadecimal):',
      },
    ];

    return inquirer.prompt(questions);
  }

  generateSvgContent({ text, textColor, shape, shapeColor }) {
    let shapeSvg = '';

    switch (shape) {
      case 'circle':
        shapeSvg = `<circle cx="150" cy="100" r="80" fill="${shapeColor}" />`;
        break;
      case 'triangle':
        shapeSvg = `<polygon points="150,10 280,190 20,190" fill="${shapeColor}" />`;
        break;
      case 'square':
        shapeSvg = `<rect x="50" y="50" width="200" height="200" fill="${shapeColor}" />`;
        break;
    }

    return `
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        ${shapeSvg}
        <text x="150" y="125" font-size="60" text-anchor="middle" fill="${textColor}">${text}</text>
      </svg>
    `.trim();
  }

  saveSvgFile(content) {
    fs.writeFile('logo.svg', content, err => {
      if (err) {
        console.error('Error generating logo:', err);
      } else {
        console.log('Generated logo.svg');
      }
    });
  }

  async run() {
    const answers = await this.getUserInput();
    const svgContent = this.generateSvgContent(answers);
    this.saveSvgFile(svgContent);
  }
}

module.exports = LogoGenerator;
