package com.example.arken.activity;

import android.os.Bundle;

import androidx.fragment.app.FragmentActivity;

import com.example.arken.R;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;

public class MainActivity extends FragmentActivity {
    private static GoogleSignInClient mGoogleSignInClient;
    public static final String IMAGE_PREF = "imag_pref";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build();
        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);
    }

    public static GoogleSignInClient getClient() {
        return mGoogleSignInClient;
    }
}
