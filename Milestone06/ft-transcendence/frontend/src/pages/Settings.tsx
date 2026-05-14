import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore, updateAvatar } from '../store/authStore';
import {
  fetchProfile, changePassword, updateProfile,
  requestEmailVerification, setupTwoFactor,
  verifyTwoFactorSetup, disableTwoFactor,
  deleteAccount, exportData, importProfile, createApiKey, fetchApiKeys, revokeApiKey,
} from '../api/auth';
import type { ApiKeyData } from '../api/auth';
import { translateApiMessage } from '../i18n';

interface GameRecord {
  id: string;
  userScore: number;
  opponentScore: number;
  opponentName: string;
  winnerId: string | null;
  createdAt: string;
}

interface ProfileData {
  id: string;
  username: string;
  name: string;
  googleName: string | null;
  email: string | null;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  provider: string;
  avatar: string | null;
  games: GameRecord[];
}

export function Settings() {
  const { t } = useTranslation();
  const { user:_user, token, logout, updateUser } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [twoFactorSetup, setTwoFactorSetup] = useState<{ qrCode: string } | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorDisable, setTwoFactorDisable] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState('');
  const [passwordSection, setPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [newName, setNewName] = useState(profile?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([]);
  const [apiKeysLoading, setApiKeysLoading] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(['read']);
  const [creatingKey, setCreatingKey] = useState(false);
  const [apiKeyError, setApiKeyError] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const navigate = useNavigate();
  const [avatarSaving, setAvatarSaving] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchProfile(token).then((data) => {
      setProfile(data);
      setEmailInput(data?.email ?? '');
      setLoading(false);
    });
  }, [token]);

  // Fetch API keys on mount
  useEffect(() => {
    if (!token) return;
    setApiKeysLoading(true);
    fetchApiKeys(token)
      .then(setApiKeys)
      .catch(() => {})
      .finally(() => setApiKeysLoading(false));
  }, [token]);

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const data = await fetchProfile(token);
      setProfile(data);
      setEmailInput(data?.email ?? '');
    } catch (err) {
      console.error("Profile refresh failed", err);
    }
  };

  useEffect(() => {
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      refreshProfile();

      const newParams = new URLSearchParams(searchParams);
      newParams.delete('verified');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleCreateApiKey = async () => {
    if (!token || !newKeyName.trim()) return;
    setCreatingKey(true);
    setApiKeyError('');
    setGeneratedKey(null);
    try {
      const created = await createApiKey(token, newKeyName.trim(), newKeyScopes);
      setGeneratedKey(created.key);
      setNewKeyName('');
      setNewKeyScopes(['read']);
      const keys = await fetchApiKeys(token);
      setApiKeys(keys);
    } catch (err) {
      setApiKeyError(translateApiMessage(err instanceof Error ? err.message : t('apiKeys.createFailed'), t));
    } finally {
      setCreatingKey(false);
    }
  };

  const handleRevokeApiKey = async (keyId: string) => {
    if (!token) return;
    setApiKeyError('');
    try {
      await revokeApiKey(token, keyId);
      setApiKeys((prev) => prev.map((k) => (k.id === keyId ? { ...k, revoked: true } : k)));
    } catch (err) {
      setApiKeyError(translateApiMessage(err instanceof Error ? err.message : t('apiKeys.revokeFailed'), t));
    }
  };

  const toggleScope = (scope: string) => {
    setNewKeyScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  };

  const handleCopyKey = async () => {
    if (!generatedKey) return;
    await navigator.clipboard.writeText(generatedKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSendVerification = async () => {
    if (!token || !emailInput.trim()) return;
    setEmailSending(true);
    setEmailError('');
    try {
      await requestEmailVerification(token, emailInput.trim());
      setProfile((p) => (p ? { ...p, email: emailInput.trim(), emailVerified: false } : null));
    } catch (err) {
      setEmailError(translateApiMessage(err instanceof Error ? err.message : 'Failed', t));
    } finally {
      setEmailSending(false);
    }
  };

  const handleSetupTwoFactor = async () => {
    if (!token) return;
    setTwoFactorLoading(true); 
    setTwoFactorError(''); 
    try {
      const data = await setupTwoFactor(token);
      setTwoFactorSetup(data);
    } catch (err) {
      setTwoFactorError(translateApiMessage(err instanceof Error ? err.message : 'Failed', t));
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleVerifyTwoFactorSetup = async () => {
    if (!token || !twoFactorCode.trim()) return;
    setTwoFactorLoading(true);
    setTwoFactorError('');
    try {
      await verifyTwoFactorSetup(token, twoFactorCode.trim());
      setTwoFactorSetup(null);
      setTwoFactorCode('');
      setProfile((p) => (p ? { ...p, twoFactorEnabled: true } : null));
    } catch (err) {
      setTwoFactorError(translateApiMessage(err instanceof Error ? err.message : 'Invalid code', t));
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleDisableTwoFactor = async () => {
    if (!token || !disablePassword || !disableCode.trim()) return;
    setTwoFactorLoading(true);
    setTwoFactorError('');
    try {
      await disableTwoFactor(token, disablePassword, disableCode.trim());
      setTwoFactorDisable(false);
      setDisablePassword('');
      setDisableCode('');
      setProfile((p) => (p ? { ...p, twoFactorEnabled: false } : null));
    } catch (err) {
      setTwoFactorError(translateApiMessage(err instanceof Error ? err.message : 'Failed', t));
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!token || !currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      setPasswordError(t('errors.passwordsDoNotMatch'));
      return;
    }
    setPasswordLoading(true);
    setPasswordError('');
    try {
      await changePassword(token, currentPassword, newPassword);
      setPasswordSection(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(translateApiMessage(err instanceof Error ? err.message : 'Failed', t));
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveName = async () => {
    if (!token || !newName.trim()) return;
    setSaving(true);
    setError('');
    try {
      const updated = await updateProfile(token, newName.trim());
      updateUser({ name: updated.name });
      setProfile((p) => (p ? { ...p, name: updated.name } : null));
    } catch (err) {
      setError(translateApiMessage(err instanceof Error ? err.message : 'Update failed', t));
    } finally {
      setSaving(false);
    }
  };

const [exporting, setExporting] = useState(false);
  const [exportEmailNote, setExportEmailNote] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState('');
  const [importError, setImportError] = useState('');

  const handleDownloadData = async (format: 'json' | 'csv' | 'xml' = 'json') => {
    if (!token || !profile || exporting) return;
    setExporting(true);
    try {
      const blob = await exportData(token, format);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pong_export_${profile.username}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      if (profile.email && profile.emailVerified) {
        setExportEmailNote(true);
        setTimeout(() => setExportEmailNote(false), 5000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token || importing) return;
    setImporting(true);
    setImportError('');
    setImportSuccess('');
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const text = reader.result as string;
        const result = await importProfile(token, text);
        const data = await fetchProfile(token);
        setProfile(data);
        setEmailInput(data?.email ?? '');
        if (data?.name) {
          setNewName(data.name);
          updateUser({ name: data.name });
        }
        if (data?.avatar !== undefined) {
          updateUser({ avatar: data?.avatar ?? null });
        }
        const restored: string[] = result.restored || ['name'];
        const fields = restored.map((f: string) => t(`settings.importField_${f}`)).join(', ');
        setImportSuccess(t('settings.importSuccess', { fields }));
      } catch (err) {
        setImportError(translateApiMessage(err instanceof Error ? err.message : 'Import failed', t));
      } finally {
        setImporting(false);
        e.target.value = ''; // reset file input
      }
    };
    reader.readAsText(file);
  };

  const confirmDelete = async () => {
    if (!token) return;
    try {
      await deleteAccount(token); 
      logout(); 
      navigate('/');
    } catch (error) {
      console.error(error);
      alert(t('settings.deleteFailed'));
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    // 1. Base64に変換
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setAvatarSaving(true);
      try {
        // 2. API実行 (updateAvatar関数は別途定義が必要)
        await updateAvatar(token, base64);
        
        // 3. ローカル状態とStoreを更新
        setProfile((p) => (p ? { ...p, avatar: base64 } : null));
        updateUser({ avatar: base64 }); 
      } catch (err) {
        setError(t('errors.updateFailed') || 'Avatar upload failed');
      } finally {
        setAvatarSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <div className="flex justify-center py-16 text-gray-400">{t('common.loading')}</div>;
  if (!profile) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-6 pb-20">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">{t('settings.title') || "Settings"}</h1>
        <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest font-bold">{t('settings.subtitle') || "Account Security & Privacy"}</p>
      </header>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-2">{t('profile.account')}</h3>

        {/* --- アバター編集カード --- */}
        <div className="bg-gray-800 p-6 sm:p-8 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden relative">
          <h2 className="text-lg font-black text-white mb-2 uppercase tracking-tighter text-start">
            {t('profile.avatar') || "Profile Picture"}
          </h2>
          <p className="text-gray-500 text-[10px] mb-6 leading-relaxed italic text-start">
            {t('profile.avatarDesc') || "Upload a custom avatar (JPEG/PNG)."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* アバター画像エリア */}
            <div className="flex-shrink-0 relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700 bg-[#0f1219] shadow-inner flex items-center justify-center relative">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={t('profile.avatar') || "Avatar"} 
                    className={`w-full h-full object-cover transition-opacity ${avatarSaving ? 'opacity-30' : 'opacity-100'}`}
                  />
                ) : (
                  <span className="text-4xl">👤</span> 
                )}
                
                {avatarSaving && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full sm:w-auto flex justify-center sm:justify-end">
              <label className="w-full sm:w-32 h-[46px] flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-xl uppercase transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer whitespace-nowrap px-4">
                <span className="block truncate text-center">
                  {avatarSaving ? '...' : (t('profile.uploadNew') || 'UPLOAD')}
                </span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleAvatarChange}
                  disabled={avatarSaving}
                />
              </label>
            </div>
          </div>
        </div>

        {/* ニックネーム編集カード */}
        <div className="bg-gray-800 p-6 sm:p-8 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden">
          <h2 className="text-lg font-black text-white mb-2 uppercase tracking-tighter flex items-center gap-2">
            🪪 {t('profile.nickname')}
          </h2>
          <p className="text-gray-500 text-[10px] mb-6 leading-relaxed italic">
            {t('profile.nicknameDesc') || "This is how you'll appear to other players."}
          </p>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                className="w-full flex-1 min-w-0 px-4 py-3 rounded-xl bg-[#0f1219] border border-gray-700 text-white text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all font-bold" 
                placeholder={t('profile.nicknamePlaceholder')}
                maxLength={20}
              />
              <button 
                onClick={handleSaveName} 
                disabled={saving} 
                className="w-full sm:w-28 h-[46px] flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-xl uppercase transition-all shadow-lg active:scale-95 disabled:opacity-50 whitespace-nowrap px-4"
              >
                {saving ? '...' : t('common.save')}
              </button>
            </div>
            
            {error && (
              <p className="text-red-400 text-[10px] mt-2 font-bold uppercase px-1 animate-pulse">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* API Keys Card */}
        <div className="bg-gray-800 p-6 sm:p-8 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden">
          <h2 className="text-lg font-black text-white mb-2 uppercase tracking-tighter">
            {t('apiKeys.title')}
          </h2>
          <p className="text-gray-500 text-[10px] mb-6 leading-relaxed italic">
            {t('apiKeys.description')}
          </p>

          {/* Generated key one-time display */}
          {generatedKey && (
            <div className="mb-6 p-4 bg-green-900/10 border border-green-800/30 rounded-2xl space-y-3 animate-in fade-in duration-300">
              <p className="text-green-400 text-[10px] font-black tracking-widest">
                {t('apiKeys.keyCreated')}
              </p>
              <div className="flex gap-2">
                <code className="flex-1 text-xs bg-[#0f1219] text-green-300 p-3 rounded-xl font-mono break-all border border-gray-700">
                  {generatedKey}
                </code>
                <button
                  onClick={handleCopyKey}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-[10px] font-black uppercase transition-all active:scale-95 whitespace-nowrap"
                >
                  {copiedKey ? t('apiKeys.copied') : t('apiKeys.copy')}
                </button>
              </div>
              <button
                onClick={() => setGeneratedKey(null)}
                className="text-[10px] text-gray-500 hover:text-gray-300 uppercase font-bold"
              >
                {t('apiKeys.dismiss')}
              </button>
            </div>
          )}

          {/* Create new key form */}
          <div className="space-y-3 mb-6">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0f1219] border border-gray-700 text-white text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder={t('apiKeys.keyNamePlaceholder')}
              maxLength={64}
            />
            <div className="flex gap-2 flex-wrap">
              {['read', 'write', 'delete'].map((scope) => (
                <button
                  key={scope}
                  onClick={() => toggleScope(scope)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${
                    newKeyScopes.includes(scope)
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-[#0f1219] border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {scope}
                </button>
              ))}
            </div>
            <button
              onClick={handleCreateApiKey}
              disabled={creatingKey || !newKeyName.trim() || newKeyScopes.length === 0}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {creatingKey ? '...' : t('apiKeys.generateKey')}
            </button>
          </div>

          {apiKeyError && (
            <p className="text-red-400 text-[10px] mb-4 font-bold uppercase px-1 animate-pulse">
              {apiKeyError}
            </p>
          )}

          {/* Key list */}
          {apiKeysLoading ? (
            <p className="text-gray-500 text-xs text-center py-4">{t('common.loading')}</p>
          ) : apiKeys.length === 0 ? (
            <p className="text-gray-600 text-xs text-center py-4 italic">{t('apiKeys.noKeysYet')}</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {apiKeys.map((k) => (
                <div
                  key={k.id}
                  className={`p-3 rounded-xl border ${
                    k.revoked
                      ? 'bg-red-950/10 border-red-900/20 opacity-60'
                      : 'bg-[#0f1219] border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate">{k.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">{k.prefix}...</p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {k.scopes.map((s) => (
                          <span
                            key={s}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-400 font-bold uppercase"
                          >
                            {s}
                          </span>
                        ))}
                        {k.revoked && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-900/30 text-red-400 font-bold">
                            {t('apiKeys.revoked')}
                          </span>
                        )}
                      </div>
                    </div>
                    {!k.revoked && (
                      <button
                        onClick={() => handleRevokeApiKey(k.id)}
                        className="text-[10px] text-red-400 hover:text-red-300 font-black whitespace-nowrap transition-colors"
                      >
                        {t('apiKeys.revoke')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-2">{t('security.title')}</h3>

          {profile.provider === 'local' && (
            <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl">
              <h2 className="text-lg font-black text-white mb-6 uppercase tracking-tighter">
                🔑 {t('resetPassword.title')}
              </h2>
              {passwordSection ? (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#0f1219] border border-gray-700 text-white text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all" placeholder={t('profile.enterCurrentPassword') || "Current Password"} maxLength={20} />
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#0f1219] border border-gray-700 text-white text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all" placeholder={t('resetPassword.newPassword')} maxLength={20} />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#0f1219] border border-gray-700 text-white text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all" placeholder={t('resetPassword.confirmPassword')} maxLength={20} />
                  <div className="flex gap-3 pt-4">
                    <button onClick={handleChangePassword} disabled={passwordLoading} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase transition-all shadow-lg active:scale-95 disabled:opacity-50">
                      {passwordLoading ? '...' : t('resetPassword.submit')}
                    </button>
                    <button onClick={() => setPasswordSection(false)} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-black text-xs uppercase transition-all">
                      {t('common.cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setPasswordSection(true)} className="w-full py-4 bg-[#0f1219] hover:bg-gray-900 text-white rounded-2xl border border-gray-700 font-bold text-xs uppercase transition-all tracking-widest shadow-xl active:scale-95">
                 {t('profile.changePassword')}
                </button>
              )}
              {passwordError && <p className="text-red-500 text-[10px] mt-3 font-bold uppercase px-2 animate-pulse">{passwordError}</p>}
            </div>
          )}

        {/* メール認証カード */}
        <div className="bg-gray-800 p-6 sm:p-8 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden">
          <h2 className="text-lg font-black text-white mb-2 uppercase tracking-tighter flex items-center gap-2">
            📧 {t('profile.emailVerification')}
          </h2>
          <p className="text-gray-500 text-[10px] mb-6 leading-relaxed italic">
            {t('profile.emailVerificationDesc')}
          </p>
          
          {!profile.email || !profile.emailVerified ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  value={emailInput} 
                  onChange={(e) => setEmailInput(e.target.value)} 
                  className="w-full flex-1 min-w-0 px-4 py-3 rounded-xl bg-[#0f1219] border border-gray-700 text-white text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all" 
                  placeholder="your@email.com" 
                />
                <button 
                  onClick={handleSendVerification} 
                  disabled={emailSending} 
                  className="w-full sm:w-28 h-[46px] flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-xl uppercase transition-all shadow-lg active:scale-95 disabled:opacity-50 whitespace-nowrap px-4"
                >
                  {emailSending ? '...' : t('settings.send')}
                </button>
              </div>
              
              {!profile.emailVerified && profile.email && (
                <p className="text-yellow-500 text-[10px] font-black uppercase tracking-tighter animate-pulse flex items-center gap-2 px-1">
                  <span>⚠️</span> {t('settings.statusUnverified')}
                </p>
              )}
            </div>
          ) : (
            <div className="p-4 bg-green-900/10 border border-green-800/30 rounded-2xl flex flex-wrap gap-3 items-center justify-between shadow-inner">
              <span className="text-green-400 text-sm font-bold truncate max-w-full">
                {profile.email}
              </span>
              <span className="bg-green-500/20 text-green-500 text-[9px] px-3 py-1 rounded-full font-black tracking-widest border border-green-500/30 whitespace-nowrap">
                {t('settings.verified')}
              </span>
            </div>
          )}
          {emailError && (
            <p className="text-red-400 text-[10px] mt-3 font-bold uppercase px-1">
              {emailError}
            </p>
          )}
        </div>

          <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl">
            <h2 className="text-lg font-black text-white mb-2 uppercase tracking-tighter">🔒 {t('twoFactor.title')}</h2>
            <p className="text-gray-500 text-[10px] mb-6 italic leading-relaxed">{t('profile.enable2FADesc')}</p>
            {profile.twoFactorEnabled ? (
              <div className="space-y-4">
                <div className="bg-green-900/10 p-4 rounded-2xl border border-green-800/30 flex justify-between items-center">
                  <span className="text-green-400 text-[10px] font-black tracking-widest uppercase">✓ {t('settings.active')}</span>
                <button onClick={() => setTwoFactorDisable(true)} className="text-[10px] text-red-400 hover:underline uppercase font-bold tracking-tighter">✗ {t('settings.disable2FA')}</button>
                </div>
                {twoFactorDisable && (
                  <div className="space-y-3 pt-2">
                    <input type="password" value={disablePassword} onChange={(e) => setDisablePassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#0f1219] border border-gray-700 text-white text-sm outline-none" placeholder="Password" maxLength={20} />
                    <input type="text" value={disableCode} onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))} className="w-full px-4 py-3 rounded-xl bg-[#0f1219] border border-gray-700 text-white text-center font-mono tracking-[0.5em]" maxLength={6} placeholder="000000" />
                    <button onClick={handleDisableTwoFactor} disabled={twoFactorLoading} className="w-full py-3 bg-red-600 text-white rounded-xl font-black uppercase text-xs transition-all">{twoFactorLoading ? '...' : t('settings.confirmDisable')}</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {twoFactorSetup ? (
                  <div className="text-center space-y-4">
                    <div className="bg-white p-2 inline-block rounded-2xl shadow-inner"><img src={twoFactorSetup.qrCode} className="w-32 h-32" alt="2FA QR" /></div>
                    <input type="text" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))} className="w-full px-4 py-3 rounded-xl bg-[#0f1219] border border-gray-700 text-white text-center font-mono text-xl tracking-[0.4em] outline-none" placeholder="000000" />
                    <button onClick={handleVerifyTwoFactorSetup} disabled={twoFactorLoading || twoFactorCode.length !== 6} className="w-full py-3 bg-blue-600 rounded-xl text-white font-black text-xs uppercase hover:bg-blue-500 transition-all shadow-lg">{twoFactorLoading ? '...' : t('common.verify')}</button>
                  </div>
                ) : (
                  <button onClick={handleSetupTwoFactor} disabled={twoFactorLoading} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] active:scale-95 text-xs uppercase tracking-widest">{t('profile.enable2FA')}</button>
                )}
              </div>
            )}
            {twoFactorError && <p className="text-red-500 text-[10px] mt-4 font-bold uppercase text-center animate-pulse">⚠️ {twoFactorError}</p>}
          </div>


          <div className="space-y-6 pt-4">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
            {t('settings.dataManagement')}
          </h3>

          <div className="space-y-4">

          {/* 1. Download Data Card */}
          <div className="bg-gray-800 p-6 sm:p-8 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1 text-left w-full sm:w-auto">
                <p className="text-sm font-black text-gray-200 uppercase tracking-tighter">
                  {t('settings.downloadData')}
                </p>
                <p className="text-[10px] text-gray-500 mt-1 font-bold italic leading-relaxed">
                  {t('settings.downloadDataDesc')}
                </p>
              </div>

              <div className="flex flex-row flex-nowrap items-center justify-end gap-2 shrink-0 ml-auto">
                {(['json', 'csv', 'xml'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleDownloadData(fmt)}
                    disabled={exporting}
                    className="px-3 sm:px-4 h-[46px] min-w-[55px] sm:min-w-[64px] flex items-center justify-center bg-[#0f1219] hover:bg-gray-700 text-white rounded-xl text-[10px] font-black uppercase transition-all border border-gray-700 shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {exporting ? '...' : fmt}
                  </button>
                ))}
              </div>
            </div>
            {exportEmailNote && (
              <p className="text-[10px] text-green-400 mt-3 font-bold animate-in fade-in duration-300">
                {t('settings.exportEmailNote')}
              </p>
            )}
          </div>

          {/* Import Data Card */}
          <div className="bg-gray-800 p-6 sm:p-8 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1 text-left w-full sm:w-auto">
                <p className="text-sm font-black text-gray-200 uppercase tracking-tighter">
                  {t('settings.importData')}
                </p>
                <p className="text-[10px] text-gray-500 mt-1 font-bold italic leading-relaxed">
                  {t('settings.importDataDesc')}
                </p>
                <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">
                  {t('settings.importFormatNote')}
                </p>
              </div>
              <label className="w-full sm:w-28 h-[46px] flex items-center justify-center bg-[#0f1219] hover:bg-gray-700 text-white rounded-xl text-[10px] font-black uppercase transition-all border border-gray-700 shadow-md active:scale-95 cursor-pointer whitespace-nowrap px-4">
                <span className="block truncate text-center">
                  {importing ? '...' : t('settings.importButton')}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".json,.csv,.xml"
                  onChange={handleImportData}
                  disabled={importing}
                />
              </label>
            </div>
            {importSuccess && (
              <p className="text-green-400 text-[10px] mt-3 font-bold uppercase px-1">{importSuccess}</p>
            )}
            {importError && (
              <p className="text-red-400 text-[10px] mt-3 font-bold uppercase px-1 animate-pulse">{importError}</p>
            )}
          </div>

            {/* 2. Delete Account Card */}
            <div className="bg-gray-800 p-6 sm:p-8 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-red-500 uppercase tracking-tighter">⚠️ {t('settings.deleteAccount')}</p>
                  <p className="text-[10px] text-red-400/60 mt-1 font-bold italic leading-relaxed">
                    {t('settings.deleteAccountDesc')}
                  </p>
                </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full sm:w-28 h-[46px] flex items-center justify-center bg-red-950/40 hover:bg-red-900/60 text-red-500 rounded-xl text-[10px] font-black uppercase transition-all border border-red-900/30 shadow-md active:scale-95"
                  >
                    {t('common.delete') || 'DELETE'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Custom Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-red-900/50 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border border-red-500/20">
                ⚠️
              </div>
              <h3 className="text-white font-black text-xl mb-2 uppercase tracking-tighter">{t('settings.deleteConfirmTitle')}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                {t('settings.deleteConfirmDesc')}
              </p>
              {profile?.email && profile?.emailVerified && (
                <p className="text-gray-500 text-[10px] mt-2 leading-relaxed italic">
                  {t('settings.deleteEmailNote')}
                </p>
              )}
              <div className="mb-8" />
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmDelete}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-xs uppercase transition-all shadow-lg active:scale-95"
                >
                  {t('settings.deleteYes')}
                </button>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 bg-gray-800 text-gray-400 rounded-xl font-black text-xs uppercase hover:text-white transition-all border border-gray-700"
                >
                  {t('settings.deleteNo')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}