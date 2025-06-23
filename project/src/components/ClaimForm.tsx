import React, { useState } from 'react';
import { Car, Calendar, Clock, MapPin, FileText, Mail, User, Hash, Upload } from 'lucide-react';
import { ClaimData, UploadedDocument } from '../types';
import DocumentUpload from './DocumentUpload';

interface ClaimFormProps {
  onSubmit: (data: ClaimData) => void;
}

export default function ClaimForm({ onSubmit }: ClaimFormProps) {
  const [formData, setFormData] = useState<ClaimData>({
    policyNumber: '',
    claimantName: '',
    phoneNumber: '',
    email: '',
    incidentDate: '',
    incidentTime: '',
    location: '',
    description: '',
    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    licensePlate: '',
    estimatedDamage: 0,
    hasDocuments: false,
    documentTypes: [],
    uploadedDocuments: [],
    policeReportFiled: false,
    witnessesPresent: false,
    previousClaims: 0,
    policyStartDate: '',
    policyEndDate: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ClaimData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ClaimData, string>> = {};
    if (!formData.policyNumber) newErrors.policyNumber = 'Policy number is required';
    if (!formData.claimantName) newErrors.claimantName = 'Claimant name is required';
    if (!formData.incidentDate) newErrors.incidentDate = 'Incident date is required';
    if (!formData.description) newErrors.description = 'Incident description is required';
    if (formData.estimatedDamage <= 0) newErrors.estimatedDamage = 'Estimated damage must be greater than 0';
    if (!formData.policyStartDate) newErrors.policyStartDate = 'Policy start date is required';
    if (!formData.policyEndDate) newErrors.policyEndDate = 'Policy end date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const policyValidity = `${formData.policyStartDate} to ${formData.policyEndDate}`;

      const dataToSubmit = {
        ...formData,
        "Incident Date": formData.incidentDate,
        "Policy Validity": policyValidity
      };
      console.log("🚀 Final dataToSubmit:");
      console.log(dataToSubmit);

      onSubmit(dataToSubmit);
    }
  };

  const handleDocumentTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ ...prev, documentTypes: [...prev.documentTypes, type] }));
    } else {
      setFormData(prev => ({ ...prev, documentTypes: prev.documentTypes.filter(t => t !== type) }));
    }
  };

  const handleDocumentsChange = (documents: UploadedDocument[]) => {
    setFormData(prev => ({ ...prev, uploadedDocuments: documents }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="px-8 py-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">New Insurance Claim</h1>
              <p className="text-slate-600">Please provide all required information for processing</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Personal Information */}
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Policy Number *</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.policyNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, policyNumber: e.target.value }))}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.policyNumber ? 'border-red-300' : 'border-slate-300'}`}
                    placeholder="POL-123456789"
                  />
                </div>
                {errors.policyNumber && <p className="text-sm text-red-600 mt-1">{errors.policyNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.claimantName}
                  onChange={(e) => setFormData(prev => ({ ...prev, claimantName: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.claimantName ? 'border-red-300' : 'border-slate-300'}`}
                  placeholder="John Smith"
                />
                {errors.claimantName && <p className="text-sm text-red-600 mt-1">{errors.claimantName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Policy Start Date *</label>
                <input
                  type="date"
                  value={formData.policyStartDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, policyStartDate: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.policyStartDate ? 'border-red-300' : 'border-slate-300'}`}
                />
                {errors.policyStartDate && <p className="text-sm text-red-600 mt-1">{errors.policyStartDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Policy End Date *</label>
                <input
                  type="date"
                  value={formData.policyEndDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, policyEndDate: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.policyEndDate ? 'border-red-300' : 'border-slate-300'}`}
                />
                {errors.policyEndDate && <p className="text-sm text-red-600 mt-1">{errors.policyEndDate}</p>}
              </div>
            </div>
          </section>

          {/* Incident Details */}
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Incident Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Incident Date *</label>
                <input
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, incidentDate: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.incidentDate ? 'border-red-300' : 'border-slate-300'}`}
                />
                {errors.incidentDate && <p className="text-sm text-red-600 mt-1">{errors.incidentDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Incident Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="time"
                    value={formData.incidentTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, incidentTime: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="123 Main St, City, State"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Incident Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${errors.description ? 'border-red-300' : 'border-slate-300'}`}
                  placeholder="Describe what happened in detail..."
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
              </div>
            </div>
          </section>

          {/* Vehicle Info */}
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Car className="w-5 h-5 mr-2 text-blue-600" />
              Vehicle Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Year</label>
                <input
                  type="text"
                  placeholder="2020"
                  value={formData.vehicleYear}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleYear: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Make</label>
                <input
                  type="text"
                  placeholder="Toyota"
                  value={formData.vehicleMake}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleMake: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Model</label>
                <input
                  type="text"
                  placeholder="Camry"
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleModel: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">License Plate</label>
                <input
                  type="text"
                  placeholder="ABC-1234"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData(prev => ({ ...prev, licensePlate: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Claim Details */}
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Claim Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estimated Damage Amount * ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.estimatedDamage || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedDamage: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.estimatedDamage ? 'border-red-300' : 'border-slate-300'}`}
                  placeholder="5000.00"
                />
                {errors.estimatedDamage && <p className="text-sm text-red-600 mt-1">{errors.estimatedDamage}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Previous Claims (last 5 years)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.previousClaims}
                  onChange={(e) => setFormData(prev => ({ ...prev, previousClaims: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="policeReportFiled"
                    checked={formData.policeReportFiled}
                    onChange={(e) => setFormData(prev => ({ ...prev, policeReportFiled: e.target.checked }))}
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="policeReportFiled" className="text-sm font-medium text-slate-700">
                    Police report filed
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="witnessesPresent"
                    checked={formData.witnessesPresent}
                    onChange={(e) => setFormData(prev => ({ ...prev, witnessesPresent: e.target.checked }))}
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="witnessesPresent" className="text-sm font-medium text-slate-700">
                    Witnesses present
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Supporting Documents */}
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-blue-600" />
              Supporting Documents
            </h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="hasDocuments"
                  checked={formData.hasDocuments}
                  onChange={(e) => setFormData(prev => ({ ...prev, hasDocuments: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="hasDocuments" className="text-sm font-medium text-slate-700">
                  I have supporting documents to upload
                </label>
              </div>

              {formData.hasDocuments && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">Select all document types you have:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {['Photos of damage', 'Police report', 'Witness statements', 'Repair estimates', 'Medical records'].map((docType) => (
                        <div key={docType} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={docType}
                            checked={formData.documentTypes.includes(docType)}
                            onChange={(e) => handleDocumentTypeChange(docType, e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={docType} className="text-sm text-slate-700">{docType}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-6">
                    <DocumentUpload
                      onDocumentsChange={handleDocumentsChange}
                      uploadedDocuments={formData.uploadedDocuments || []}
                      maxFiles={10}
                      maxSizePerFile={10}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-slate-200">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}