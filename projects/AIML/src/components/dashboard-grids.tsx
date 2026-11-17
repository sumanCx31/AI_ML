import { Flower2, Home, CreditCard, HeartPulse, Smile } from "lucide-react";

export interface DashboardItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  badgeColor: string;
  stats: string;
  link: string;
}

export const dashboards: DashboardItem[] = [
  {
    id: "sentiment-analysis",
    title: "AI Sentiment Analysis",
    description: "Analyze text, reviews, and feedback to instantly classify them as positive or negative using an NLP model powered by TensorFlow and Keras.",
    icon: Smile,
    badge: "Deep Learning",
    badgeColor: "bg-purple-100 text-purple-800",
    stats: "TensorFlow & FastAPI",
    link: "/sentiment-analysis", // Update this to match your router path if needed
  },
  {
    id: "house-price-prediction",
    title: "House Price Prediction",
    description: "Estimate real estate values using regression models based on location, square footage, and amenities.",
    icon: Home,
    badge: "Regression",
    badgeColor: "bg-blue-100 text-blue-800",
    stats: "R² Score: 88.5%",
    link: "/house-price-prediction",
  },
  {
    id: "iris-classification",
    title: "Iris Flower Classification",
    description: "Classify iris flower species (Setosa, Versicolor, Virginica) using petal and sepal measurements.",
    icon: Flower2,
    badge: "Classification",
    badgeColor: "bg-emerald-100 text-emerald-800",
    stats: "100% Accuracy",
    link: "/irisflower",
  },
  {
    id: "loan-status-predictor",
    title: "Loan Status Predictor",
    description: "Predict loan approval status, hold risk, and rejection probability using monthly income and credit score.",
    icon: CreditCard,
    badge: "Classification",
    badgeColor: "bg-amber-100 text-amber-800",
    stats: "92% Accuracy",
    link: "/loan-status-predictor",
  },
  {
    id: "diabetes-test",
    title: "Diabetes Risk Assessment",
    description: "Evaluate risk levels (Low, Moderate, High) using health metrics, glucose levels, and lifestyle factors.",
    icon: HeartPulse,
    badge: "Classification",
    badgeColor: "bg-rose-100 text-rose-800",
    stats: "80% Accuracy",
    link: "/diabetes-test",
  },
];

const DashboardGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {dashboards.map(({ id, title, description, icon: Icon, badge, badgeColor, stats, link }) => (
        <a key={id} href={link} className="p-5 border rounded-xl hover:shadow-lg transition block bg-white border-gray-100 group">
          <div className="flex items-center justify-between mb-3">
            <Icon className="h-7 w-7 text-indigo-600 group-hover:scale-110 transition-transform" />
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badgeColor}`}>{badge}</span>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mt-2">{title}</h2>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{description}</p>
          <span className="text-xs font-semibold text-gray-400 mt-4 block">{stats}</span>
        </a>
      ))}
    </div>
  );
};

export default DashboardGrid;