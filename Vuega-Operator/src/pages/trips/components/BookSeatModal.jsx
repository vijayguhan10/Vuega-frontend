import { useState } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaVenusMars, FaCalendarAlt } from 'react-icons/fa';
import Modal from '../../../components/ui/Modal';

/* ══════════════════════════════════════════════════════
   BookSeatModal — collects passenger details to book a
   seat. Opens when operator clicks "Book Seat" for an
   available seat.
   ══════════════════════════════════════════════════════ */

const INITIAL = { name: '', phone: '', email: '', gender: '', age: '' };

const BookSeatModal = ({ isOpen, onClose, seat, onConfirm }) => {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone.trim())) errs.phone = 'Enter a valid 10-digit number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = 'Enter a valid email';
    if (!form.gender) errs.gender = 'Select gender';
    if (!form.age) errs.age = 'Age is required';
    else if (Number(form.age) < 1 || Number(form.age) > 120) errs.age = 'Enter a valid age';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onConfirm({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      gender: form.gender,
      age: Number(form.age),
    });
    setForm(INITIAL);
    setErrors({});
  };

  const handleClose = () => {
    setForm(INITIAL);
    setErrors({});
    onClose();
  };

  if (!seat) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Book Seat #${seat.seatNumber}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Seat summary */}
        <div className="flex items-center gap-4 px-4 py-3 rounded-lg bg-v-secondary/40 border border-v-secondary-border">
          <div className="flex flex-col">
            <span className="text-v-text-muted">Seat</span>
            <span className="font-semibold text-v-text">#{seat.seatNumber}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-v-text-muted">Type</span>
            <span className="font-semibold text-v-text capitalize">{seat.type}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-v-text-muted">Price</span>
            <span className="font-semibold text-v-text">₹{seat.finalPrice}</span>
          </div>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-v-text-secondary flex items-center gap-2">
            <FaUser size={14} /> Passenger Name <span className="text-v-critical">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter full name"
            className={`w-full px-3 py-2.5 rounded-lg border bg-v-primary-bg text-v-text focus:outline-none focus:ring-2 focus:ring-v-accent transition-colors ${
              errors.name ? 'border-v-critical' : 'border-v-border'
            }`}
          />
          {errors.name && <span className="text-v-critical font-medium">{errors.name}</span>}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-v-text-secondary flex items-center gap-2">
            <FaPhone size={14} /> Phone Number <span className="text-v-critical">*</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="10-digit phone number"
            maxLength={10}
            className={`w-full px-3 py-2.5 rounded-lg border bg-v-primary-bg text-v-text focus:outline-none focus:ring-2 focus:ring-v-accent transition-colors ${
              errors.phone ? 'border-v-critical' : 'border-v-border'
            }`}
          />
          {errors.phone && <span className="text-v-critical font-medium">{errors.phone}</span>}
        </div>

        {/* Email (optional) */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-v-text-secondary flex items-center gap-2">
            <FaEnvelope size={14} /> Email <span className="text-v-text-muted">(optional)</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="passenger@email.com"
            className={`w-full px-3 py-2.5 rounded-lg border bg-v-primary-bg text-v-text focus:outline-none focus:ring-2 focus:ring-v-accent transition-colors ${
              errors.email ? 'border-v-critical' : 'border-v-border'
            }`}
          />
          {errors.email && <span className="text-v-critical font-medium">{errors.email}</span>}
        </div>

        {/* Gender + Age row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Gender */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-v-text-secondary flex items-center gap-2">
              <FaVenusMars size={14} /> Gender <span className="text-v-critical">*</span>
            </label>
            <select
              value={form.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className={`w-full px-3 py-2.5 rounded-lg border bg-v-primary-bg text-v-text focus:outline-none focus:ring-2 focus:ring-v-accent transition-colors ${
                errors.gender ? 'border-v-critical' : 'border-v-border'
              }`}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <span className="text-v-critical font-medium">{errors.gender}</span>}
          </div>

          {/* Age */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-v-text-secondary flex items-center gap-2">
              <FaCalendarAlt size={14} /> Age <span className="text-v-critical">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={120}
              value={form.age}
              onChange={(e) => handleChange('age', e.target.value)}
              placeholder="Age"
              className={`w-full px-3 py-2.5 rounded-lg border bg-v-primary-bg text-v-text focus:outline-none focus:ring-2 focus:ring-v-accent transition-colors ${
                errors.age ? 'border-v-critical' : 'border-v-border'
              }`}
            />
            {errors.age && <span className="text-v-critical font-medium">{errors.age}</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-v-border">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 rounded-lg font-medium text-v-text-secondary border border-v-border hover:bg-v-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white border border-green-700 transition-colors shadow-sm"
          >
            Confirm Booking
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BookSeatModal;
