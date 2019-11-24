package com.example.arken.fragment;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.Html;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;
import androidx.viewpager.widget.ViewPager;

import com.example.arken.R;
import com.example.arken.activity.MainActivity;
import com.example.arken.model.GoogleId;
import com.example.arken.model.GoogleUser;
import com.example.arken.model.Profile;
import com.example.arken.model.User;
import com.example.arken.util.RetroClient;
import com.example.arken.util.SliderAdapter;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

import java.util.PropertyPermission;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import static android.content.ContentValues.TAG;
import static android.content.Context.MODE_PRIVATE;
import static com.example.arken.fragment.LoginFragment.MY_PREFS_NAME;

public class StartFragment extends Fragment implements View.OnClickListener {
    private Button loginButton;
    private Button signUpButton;
    private Button guestButton;
    private ViewPager slideViewPager;
    private SliderAdapter sliderAdapter;
    private LinearLayout dotsLayout;
    private TextView[] dots;
    private ImageButton signupGoogle;
    private static final int RC_SIGN_IN = 2;
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_start, container, false);
        loginButton = view.findViewById(R.id.start_login_button);
        signUpButton = view.findViewById(R.id.start_signup_button);
        guestButton = view.findViewById(R.id.signup_guest_button);
        slideViewPager = view.findViewById(R.id.slideViewPager);
        dotsLayout = view.findViewById(R.id.dotsLayout);

        guestButton.setOnClickListener(this);
        loginButton.setOnClickListener(this);
        signUpButton.setOnClickListener(this);
        signupGoogle = view.findViewById(R.id.signin_google_button);
        signupGoogle.setOnClickListener(this);
        OnBackPressedCallback callback = new OnBackPressedCallback(true ) {
            @Override
            public void handleOnBackPressed() {getActivity().finish();}

        };
       requireActivity().getOnBackPressedDispatcher().addCallback(this, callback);


        sliderAdapter = new SliderAdapter(getContext());
        slideViewPager.setAdapter(sliderAdapter);

        addDotsIndicator(0);

        slideViewPager.addOnPageChangeListener(viewListener);

        return view;
    }

    @Override
    public void onClick(View view) {
        if(view.getId() == R.id.start_login_button){
            Navigation.findNavController(view).navigate(R.id.action_startFragment_to_loginFragment);
        } else if(view.getId() == R.id.start_signup_button){
            Navigation.findNavController(view).navigate(R.id.action_startFragment_to_signupFragment);
        } else if (view.getId() == R.id.signup_guest_button) {
            Navigation.findNavController(view).navigate(R.id.action_startFragment_to_baseFragment);
        } else if (view.getId() == R.id.signin_google_button){
            signIn();
        }

    }

    public void addDotsIndicator(int position) {
        dots = new TextView[5];
        dotsLayout.removeAllViews();

        for(int i=0; i < dots.length; i++) {

            dots[i] = new TextView(getContext());
            dots[i].setText(Html.fromHtml("&#8226;"));
            dots[i].setTextSize(35);
            dots[i].setTextColor(getResources().getColor(R.color.colorLightGray));

            dotsLayout.addView(dots[i]);
        }

        if(dots.length > 0) {

            dots[position].setTextColor(getResources().getColor(R.color.whiteTextColor));

        }
    }

    ViewPager.OnPageChangeListener viewListener = new ViewPager.OnPageChangeListener() {
        @Override
        public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

        }

        @Override
        public void onPageSelected(int position) {

            addDotsIndicator(position);
        }

        @Override
        public void onPageScrollStateChanged(int state) {

        }
    };

    private void signIn() {
        Intent signInIntent = MainActivity.getClient().getSignInIntent();
        startActivityForResult(signInIntent, RC_SIGN_IN);
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == Activity.RESULT_OK) {
            switch (requestCode) {
                case RC_SIGN_IN:
                    try {
                        // The Task returned from this call is always completed, no need to attach
                        // a listener.
                        Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
                        GoogleSignInAccount account = task.getResult(ApiException.class);
                        onLoggedIn(account, false);
                    } catch (ApiException e) {
                        // The ApiException status code indicates the detailed failure reason.
                        Log.w(TAG, "signInResult:failed code=" + e.getStatusCode());
                    }
                    break;
            }
        }
    }
    private void onLoggedIn(GoogleSignInAccount googleSignInAccount, final boolean onStart) {
        Call<User> call;

        call = RetroClient.getInstance().getAPIService().google(new GoogleId( googleSignInAccount.getId()));

        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    //google login fragment???
                    User pr = response.body();
                    SharedPreferences.Editor editor = getActivity().getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE).edit();
                    editor.putString("userId",pr.get_id());
                    String cookie = response.headers().get("Set-Cookie");
                    editor.putString("user_cookie", cookie.split(";")[0]);
                    editor.commit();
                    Log.i("basee ",response.raw().toString());
                    Navigation.findNavController(guestButton).navigate(R.id.action_startFragment_to_baseFragment);
                } else if(!onStart){
                    Navigation.findNavController(guestButton).navigate(R.id.action_startFragment_to_googleSignupFragment);
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Toast.makeText(getContext(), t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
    @Override
    public void onStart() {
        super.onStart();
        GoogleSignInAccount alreadyloggedAccount = GoogleSignIn.getLastSignedInAccount(getContext());
        if (alreadyloggedAccount != null) {
            onLoggedIn(alreadyloggedAccount, true);
        } else {
            final SharedPreferences prefs = getActivity().getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE);
            String email = prefs.getString("email", "default");//"No name defined" is the default value.
            if(!email.equals("default")){
                Navigation.findNavController(guestButton).navigate(R.id.action_startFragment_to_baseFragment);
            }
        }
    }
}
