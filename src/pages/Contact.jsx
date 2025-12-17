import { useState } from "react";
import { useSubmitContact } from "../hooks/useApi";
import { Mail, Globe, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function Contact() {
  const submitContact = useSubmitContact();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "inquiry",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const toastId = toast.loading("Sending message...");
    
    submitContact.mutate(formData, {
      onSuccess: () => {
        toast.success("Message sent successfully!", { id: toastId });
        setFormData({ name: "", email: "", subject: "inquiry", message: "" });
      },
      onError: (err) => {
        console.error(err);
        toast.error("Failed to send message.", { id: toastId });
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Contact Us</h1>
        <p className="text-slate-600">Have questions or suggestions? We'd love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Email Us</h3>
              <p className="text-slate-600 text-sm mb-2">For general inquiries and support.</p>
              <a href="mailto:support@ets2mods.com" className="text-blue-600 font-medium hover:underline">support@ets2mods.com</a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Social Media</h3>
              <p className="text-slate-600 text-sm mb-2">Follow us for the latest updates.</p>
              <div className="flex gap-4 text-slate-500">
                <a href="#" className="hover:text-blue-600 transition">Twitter</a>
                <a href="#" className="hover:text-blue-600 transition">Discord</a>
                <a href="#" className="hover:text-blue-600 transition">Facebook</a>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2">Report a Mod?</h3>
            <p className="text-blue-800 text-sm mb-4">
              If you found a mod that violates our terms or contains malware, please report it directly on the mod's page or select "Report a Mod" in the subject line.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Send a Message</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="label">Your Name</label>
              <input 
                name="name"
                type="text" 
                className="input-field" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input 
                name="email"
                type="email" 
                className="input-field" 
                placeholder="john@example.com" 
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">Subject</label>
              <select 
                name="subject"
                className="input-field"
                value={formData.subject}
                onChange={handleChange}
              >
                <option value="inquiry">General Inquiry</option>
                <option value="support">Support Request</option>
                <option value="dmca">DMCA / Copyright</option>
                <option value="feedback">Feedback</option>
                <option value="report">Report a Mod</option>
              </select>
            </div>
            <div>
              <label className="label">Message</label>
              <textarea 
                name="message"
                className="input-field h-32 resize-none" 
                placeholder="How can we help you?"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={submitContact.isPending}
              className="btn-primary w-full"
            >
              {submitContact.isPending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}