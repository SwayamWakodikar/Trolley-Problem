import { motion } from 'framer-motion';
import { Scale, Heart, Brain, Car, Shield, BookOpen, User, Split } from 'lucide-react';

function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Understanding the Trolley Problem</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What Is It?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The trolley problem is a thought experiment in ethics and moral philosophy. First introduced
            by philosopher Philippa Foot in 1967, it presents a moral dilemma that forces us to choose
            between two undesirable outcomes.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The scenario asks whether it's morally permissible to actively cause harm to prevent a greater
            harm. It reveals deep tensions between different ethical frameworks and our moral intuitions.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Scale className="text-blue-600" size={28} />
            Key Ethical Theories
          </h2>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Utilitarianism</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                <strong>Core Principle:</strong> The greatest good for the greatest number.
              </p>
              <p className="text-gray-700 leading-relaxed mb-2">
                Utilitarians focus on outcomes and consequences. In the trolley problem, a utilitarian
                would likely pull the lever because saving five lives produces more overall good than
                saving one.
              </p>
              <p className="text-gray-600 italic">
                "Act always so as to produce the greatest happiness for the greatest number."
                - Jeremy Bentham
              </p>
            </div>

            <div className="border-l-4 border-gray-600 pl-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Deontology</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                <strong>Core Principle:</strong> Actions are inherently right or wrong, regardless of outcomes.
              </p>
              <p className="text-gray-700 leading-relaxed mb-2">
                Deontologists, following Kant, argue that certain actions are morally forbidden regardless
                of consequences. Actively killing someone (by pulling the lever) is wrong, even if it saves
                more lives.
              </p>
              <p className="text-gray-600 italic">
                "Act only according to that maxim whereby you can at the same time will that it should
                become a universal law." - Immanuel Kant
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Virtue Ethics</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                <strong>Core Principle:</strong> Focus on character and what a virtuous person would do.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Virtue ethicists would consider what traits like courage, compassion, and wisdom suggest.
                They might ask: What would a person of good character do in this situation?
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Brain className="text-blue-600" size={28} />
            Real-World Applications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Car className="text-blue-600 mb-2" size={32} />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Self-Driving Cars</h3>
              <p className="text-gray-700">
                Autonomous vehicles must be programmed with ethical decision-making algorithms.
                Should a car prioritize passengers or pedestrians in an unavoidable crash?
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <Shield className="text-blue-600 mb-2" size={32} />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Military Decisions</h3>
              <p className="text-gray-700">
                Military operations often involve trolley-problem-like scenarios where commanders must
                decide between civilian casualties and strategic objectives.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <Heart className="text-blue-600 mb-2" size={32} />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Medical Triage</h3>
              <p className="text-gray-700">
                In emergency situations with limited resources, medical professionals must decide
                who receives treatment first, weighing probabilities and potential outcomes.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <Brain className="text-blue-600 mb-2" size={32} />
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI Ethics</h3>
              <p className="text-gray-700">
                As AI systems make more decisions affecting human lives, programmers must embed
                ethical frameworks into algorithms that handle life-or-death scenarios.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Split className="text-blue-600" size={28} />
            Variation
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">The Fat Man Variant</h3>
              <p className="text-gray-700">
                Instead of pulling a lever, you must push a large person off a bridge to stop the trolley.
                This variant tests whether the method of intervention affects our moral judgment.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">The Loop Variant</h3>
              <p className="text-gray-700">
                The side track loops back to the main track. The one person on the side track would stop
                the trolley from continuing to the five. Here, you're using someone as a means to an end.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">The Loved One Variant</h3>
              <p className="text-gray-700">
                What if the one person on the side track is someone you love? Does personal connection
                change our moral calculus?
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-8 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="text-blue-600" size={28} />
            Further Reading
          </h2>

          <ul className="space-y-3 text-gray-700">
            <li>
              <a
                href="https://plato.stanford.edu/entries/doing-allowing/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                Stanford Encyclopedia of Philosophy: Doing vs. Allowing Harm
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/watch?v=bOpf6KcWYyw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                The Trolley Problem (TED-Ed Video)
              </a>
            </li>
            <li>
              <strong>Book:</strong> "Would You Kill the Fat Man?" by David Edmonds
            </li>
            <li>
              <strong>Book:</strong> "The Trolley Problem Mysteries" by F.M. Kamm
            </li>
            <li>
              <strong>Paper:</strong> "The Problem of Abortion and the Doctrine of Double Effect"
              by Philippa Foot (1967)
            </li>
          </ul>
        </div>
              <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="text-BLACK-600" size={28} />
            Made By
          </h2>

          
              {/* <a
                href="https://plato.stanford.edu/entries/doing-allowing/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                Stanford Encyclopedia of Philosophy: Doing vs. Allowing Harm
              </a> */}
              <div className='text-3xl font-bold '> Name: Swayam Wakodikar</div>
              <div className='text-3xl font-bold '>24BEC7056</div>
              <br />
              <ul className='text-xl font-medium'>
                <ol className='space-y-3 list-disc'>
                  <div className='text-2xl'>
                    Team: -
                  </div>
                  <div className='pl-3 space-y-3'>
                    <li>
                    Soumik Paul 24BEC7010
                  </li>
                  <li>
                    Shayan Siddiqui 24BEC7118
                  </li>
                  <li>
                    N Syed Dawood Rehan 24BEC7076
                  </li>
                  <li>
                    Adityanarayan Pandey 24BEC7129
                  </li>
                  <li>
                    Nakhireddi Meghana 24BEC7012
                  </li>
                  <li>
                    Gothina Bhuvana Sree 24BEC7037
                  </li>
                  <li>
                    Vinjamuri Goutham 24BEC7109
                  </li>
                  <li>
                    Gollapilli Sri Pranav 24BEC7120
                  </li>
                  </div>
                  
                </ol>
              </ul>
            
            {/* <li>
              <a
                href="https://www.youtube.com/watch?v=bOpf6KcWYyw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                The Trolley Problem (TED-Ed Video)
              </a>
            </li>
            <li>
              <strong>Book:</strong> "Would You Kill the Fat Man?" by David Edmonds
            </li>
            <li>
              <strong>Book:</strong> "The Trolley Problem Mysteries" by F.M. Kamm
            </li>
            <li>
              <strong>Paper:</strong> "The Problem of Abortion and the Doctrine of Double Effect"
              by Philippa Foot (1967)
            </li>
          </ul> */}
        </div>
      </motion.div>
    </div>
  );
}

export default AboutPage;
