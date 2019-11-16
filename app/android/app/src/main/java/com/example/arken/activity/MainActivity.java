package com.example.arken.activity;

import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import androidx.fragment.app.FragmentActivity;
import androidx.navigation.Navigation;

import com.example.arken.R;
import com.example.arken.fragment.BaseFragment;
import com.example.arken.fragment.CommentFragment;
import com.example.arken.fragment.EventFragment;
import com.example.arken.fragment.ListCommentFragment;
import com.example.arken.model.Comment;
import com.example.arken.model.Event;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;

import org.jetbrains.annotations.NotNull;

public class MainActivity extends FragmentActivity implements CommentFragment.OnCommentSubmitted {
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

    @Override
    public void onSubmit(@NotNull Comment comment, TextView textView) {
        // Get Fragment B
        if(Navigation.findNavController(textView).getCurrentDestination().getId() == R.id.eventFragment){
            EventFragment eventFragment = (EventFragment)getSupportFragmentManager().findFragmentById(R.id.eventFragment);
            //listCommentFragment.addToDataset(comment);
            Log.i("burada", " sfsff");
        }

    }
}
