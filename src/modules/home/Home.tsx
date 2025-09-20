import { Link } from 'react-router-dom'
import { BookOpen, Play, Users, BarChart3 } from 'lucide-react'
import { sampleVocabItems } from '../../data/sampleVocab'
import { calculateMastery, formatMasteryPercent } from '../../core/algo/stats'

export function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Vocab Queue Master
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Master vocabulary with smart spaced repetition designed for Grade 5 learners
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Quick Start - Sample Mode
          </h2>
          <p className="text-gray-600 mb-6">
            Try our vocabulary learning system with a sample set of 5 words
          </p>
          <Link
            to="/study"
            className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Play className="h-5 w-5" />
            <span>Start Learning</span>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <h3 className="text-xl font-semibold text-gray-800">Smart Learning</h3>
          </div>
          <p className="text-gray-600">
            Our algorithm adapts to your learning pace with spaced repetition and mastery tracking
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-8 w-8 text-success-600" />
            <h3 className="text-xl font-semibold text-gray-800">Grade 5 Focused</h3>
          </div>
          <p className="text-gray-600">
            Designed specifically for Grade 5 learners with age-appropriate vocabulary and interface
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Play className="h-8 w-8 text-warning-600" />
            <h3 className="text-xl font-semibold text-gray-800">Multiple Modes</h3>
          </div>
          <p className="text-gray-600">
            Practice with multiple choice, true/false, and typing exercises
          </p>
        </div>
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">How It Works</h3>
        <ul className="text-blue-700 space-y-2">
          <li>• Words you get wrong come back sooner for more practice</li>
          <li>• First-time correct answers move to the end of the queue</li>
          <li>• Second-time correct answers are mastered for the session</li>
          <li>• Time decay ensures you review words before you forget them</li>
        </ul>
      </div>
    </div>
  )
}
